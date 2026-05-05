import fastf1
import psycopg2
import os
import json
from dotenv import load_dotenv
from psycopg2.extras import execute_values

load_dotenv(".env.local")
fastf1.Cache.enable_cache("pipeline/cache")

conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()

YEARS = range(2024, 2026) 
SESSION_TYPE = "R"

def get_ms(time_delta):
    if str(time_delta) == "NaT" or time_delta is None:
        return None
    return int(time_delta.total_seconds() * 1000)

for year in YEARS:
    schedule = fastf1.get_event_schedule(year, include_testing=False)

    for _, event in schedule.iterrows():
        round_number = int(event["RoundNumber"])
        circuit_name = event["EventName"]
        print(f"\nLoading {year} Round {round_number} - {circuit_name}...")

        try:
            session = fastf1.get_session(year, round_number, SESSION_TYPE)
            session.load(telemetry=True)
        except Exception as e:
            print(f" SKIP - failed to load: {e}")
            continue

        # Handle Track Data
        cur.execute("SELECT id FROM tracks WHERE circuit_name ILIKE %s", (circuit_name,))
        if not cur.fetchone():
            print(f"  Extracting track data for {circuit_name}...")
            try:
                fastest_lap = session.laps.pick_fastest()
                telemetry = fastest_lap.get_telemetry()
                
                points = []
                for i, row in telemetry.iloc[::5].iterrows():
                    points.append({"x": float(row["X"]), "y": float(row["Y"]), "dist": float(row["Distance"])})
                
                last_row = telemetry.iloc[-1]
                points.append({"x": float(last_row["X"]), "y": float(last_row["Y"]), "dist": float(last_row["Distance"])})
                
                sector_boundaries = {
                    "s1": 0.33, # Default approximations, can be refined
                    "s2": 0.66,
                    "s3": 1.0
                }
                
                cur.execute(
                    "INSERT INTO tracks (circuit_name, points, sector_boundaries) VALUES (%s, %s, %s)",
                    (circuit_name, json.dumps(points), json.dumps(sector_boundaries))
                )
            except Exception as e:
                print(f"  Failed to extract track data: {e}")

        # Handle Session
        cur.execute("""
            INSERT INTO sessions (year, round, circuit, country, session_type, session_date)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (year, round, session_type) DO NOTHING
            RETURNING id
         """, (year, round_number, circuit_name, event["Country"], SESSION_TYPE, str(session.date.date())))
        
        row = cur.fetchone()
        session_id = row[0] if row else None
        if not session_id:
            cur.execute("SELECT id FROM sessions WHERE year = %s AND round = %s AND session_type = %s", (year, round_number, SESSION_TYPE))
            session_id = cur.fetchone()[0]

        # Process Laps
        drivers = session.laps["Driver"].unique()
        lap_rows = []
        for driver in drivers:
            driver_laps = session.laps.pick_drivers(driver)
            for _, lap in driver_laps.iterrows():
                lap_rows.append((
                    session_id, driver, lap["Team"], int(lap["LapNumber"]),
                    get_ms(lap["LapTime"]), lap["Compound"],
                    int(lap["TyreLife"]) if str(lap["TyreLife"]) != "nan" else None,
                    bool(lap["IsPersonalBest"]), bool(lap.get("Deleted", False)),
                    get_ms(lap["Sector1Time"]), get_ms(lap["Sector2Time"]), get_ms(lap["Sector3Time"])
                ))

        # Clear existing laps for this session to re-insert with sectors
        cur.execute("DELETE FROM laps WHERE session_id = %s", (session_id,))

        execute_values(cur, """
            INSERT INTO laps (session_id, driver, team, lap_number, lap_time_ms, compound, tyre_life, is_personal_best, is_deleted, s1_ms, s2_ms, s3_ms)
            VALUES %s
        """, lap_rows)
        
        conn.commit()
        print(f"  Done - {len(lap_rows)} laps inserted with sector data.")

cur.close()
conn.close()
print("\nALL done.")
