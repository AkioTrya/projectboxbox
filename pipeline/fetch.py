import fastf1

fastf1.Cache.enable_cache("cache")

# Load 2024 Monaco GP Race
session = fastf1.get_session(2024, "Monaco", "R")
session.load()

# Get the fastest lap of the whole race
fastest = session.laps.pick_fastest()

print("=== FASTEST LAP ===")
print(f"Driver: {fastest['Driver']}")
print(f"Lap Time: {fastest['LapTime']}")
print(f"Lap Number: {fastest['LapNumber']}")
print(f"Compound: {fastest['Compound']}")

# Get full telemetry for that lap
telemetry = fastest.get_telemetry()

print("\n=== TELEMETRY CHANNELS ===")
print(telemetry.columns.tolist())

print("\n=== FIRST 5 SAMPLES ===")
print(telemetry[["Speed", "Throttle", "Brake", "nGear", "DRS"]].head())