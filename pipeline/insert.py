import fastf1
import psycopg2
import os
from dotenv import load_dotenv
from psycopg2.extras import execute_values

load_dotenv()
fastf1.Cache.enable_cache("cache")

conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()

YEARS = range(2018, 2026)
SESSION_TYPE = "R"

for year in YEARS:
    schedule = fastf1.get_event_schedule(year, include_testing=False)

    for _, event in schedule.iterrows():
        round_number = int(event["RoundNumber"])
        print(f"\nLoading {year} Round {round_number} - {event['EventName']}...")

        try:
            session = fastf1.get_session(year, round_number, SESSION_TYPE)
            session.load(telemetry=False)
            drivers = session.laps["Driver"].unique()
        except Exception as e:
            print(f" SKIP - failed to load: {e}")
            continue

        cur.execute("""
            INSERT INTO sessions (year, round, circuit, country, session_type, session_date)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (year, round, session_type) DO NOTHING
            RETURNING id
         """, (
            year,
            round_number,
            event["EventName"],
            event["Country"],
            SESSION_TYPE,
            str(session.date.date())
            ))
        
        row = cur.fetchone()
        if row:
            session_id = row[0]
        else:
            cur.execute(
                "SELECT id FROM sessions WHERE year = %s AND round = %s AND session_type = %s",
                (year, round_number, SESSION_TYPE)
            )
            session_id = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM laps WHERE session_id = %s", (session_id,))
            if cur.fetchone()[0] > 0:
                print(f"  SKIP - laps already exists for session {session_id}")
                continue
                

        drivers = session.laps["Driver"].unique()
        lap_rows = []
        for driver in drivers:
            driver_laps = session.laps.pick_drivers(driver)
            for _, lap in driver_laps.iterrows():
                lap_time_ms = int(lap["LapTime"].total_seconds() * 1000) if str(lap["LapTime"]) != "NaT" else None

                lap_rows.append((
                    session_id,
                    driver,
                    lap["Team"],
                    int(lap["LapNumber"]),
                    lap_time_ms,
                    lap["Compound"],
                    int(lap["TyreLife"]) if str(lap["TyreLife"]) != "nan" else None,
                    bool(lap["IsPersonalBest"]),
                    bool(lap["Deleted"])
                ))

        execute_values(cur, """
                       INSERT INTO laps (session_id, driver,team, lap_number, lap_time_ms, compound, tyre_life, is_personal_best, is_deleted)
                       VALUES %s
                       """, lap_rows)
        
        conn.commit()
        print(f"  Done - {len(lap_rows)} laps inserted")

cur.close()
conn.close()
print("\nALL done.")


