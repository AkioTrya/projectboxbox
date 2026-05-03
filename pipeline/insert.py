import fastf1
import psycopg2
import os
from dotenv import load_dotenv
from psycopg2.extras import execute_values

load_dotenv()
fastf1.Cache.enable_cache("cache")

conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()

# ── CONFIG ──────────────────────────────
YEAR = 2024
RACE = "Monaco"
SESSION_TYPE = "R"
DRIVERS = ["HAM", "VER", "LEC", "ANT", "RUS"]
# ────────────────────────────────────────

print(f"Loading {YEAR} {RACE} {SESSION_TYPE}...")
session = fastf1.get_session(YEAR, RACE, SESSION_TYPE)
session.load()

event = session.event

# Insert session
cur.execute("""
    INSERT INTO sessions (year, round, circuit, country, session_type, session_date)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (year, round, session_type) DO NOTHING
    RETURNING id
""", (
    YEAR,
    int(event["RoundNumber"]),
    event["EventName"],
    event["Country"],
    SESSION_TYPE,
    str(session.date.date())
))

row = cur.fetchone()
if row:
    session_id = row[0]
    print(f"Session inserted: id={session_id}")
else:
    cur.execute("SELECT id FROM sessions WHERE year=%s AND round=%s AND session_type=%s",
                (YEAR, int(event["RoundNumber"]), SESSION_TYPE))
    session_id = cur.fetchone()[0]
    print(f"Session already exists: id={session_id}")

for driver in DRIVERS:
    print(f"Processing {driver}...")
    driver_laps = session.laps.pick_drivers(driver)

    for _, lap in driver_laps.iterrows():
        lap_time_ms = int(lap["LapTime"].total_seconds() * 1000) if str(lap["LapTime"]) != "NaT" else None

        cur.execute("""
            INSERT INTO laps (session_id, driver, team, lap_number, lap_time_ms, compound, tyre_life, is_personal_best, is_deleted)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
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

        lap_id = cur.fetchone()[0]

# Batch insert telemetry
        try:
            tel = lap.get_car_data().add_distance()
            tel = tel[["Distance", "Speed", "Throttle", "Brake", "nGear", "DRS"]]
            tel = tel[tel["Speed"] > 0].dropna()

            rows = [
                (
                    lap_id,
                    float(r["Distance"]),
                    float(r["Speed"]),
                    float(r["Throttle"]),
                    bool(r["Brake"]),
                    int(r["nGear"]),
                    int(r["DRS"]),
                    None,
                    None
                )
                for _, r in tel.iterrows()
            ]

            execute_values(cur, """
                INSERT INTO telemetry (lap_id, distance, speed, throttle, brake, gear, drs, x, y)
                VALUES %s
            """, rows)

        except Exception as e:
            print(f"  Telemetry error lap {int(lap['LapNumber'])}: {e}")

    conn.commit()
    print(f"  {driver} done")

cur.close()
conn.close()
print("\nAll done.")