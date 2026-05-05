import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()

cur.execute("""
    SELECT driver, COUNT(*) 
    FROM laps l
    JOIN sessions s ON l.session_id = s.id
    WHERE s.circuit ILIKE '%Bahrain%' AND s.year = 2025
    GROUP BY driver
    ORDER BY COUNT(*) DESC
""")
rows = cur.fetchall()
for row in rows:
    print(f"Driver {row[0]}: {row[1]} laps")

cur.close()
conn.close()
