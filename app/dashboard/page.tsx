"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { THEMES, TYRE_COLORS, Theme } from "@/app/lib/themes";
import TrackMap from "@/app/components/TrackMap";

const DRIVER_COLORS: Record<string, string> = {
  HAM: "#00D2BE",
  VER: "#3671C6",
  LEC: "#E8002D",
  SAI: "#E8002D",
  RUS: "#00D2BE",
  NOR: "#FF8000",
  PIA: "#FF8000",
  ALO: "#229971",
  STR: "#229971",
  PER: "#3671C6",
  GAS: "#0093CC",
  OCO: "#0093CC",
  ALB: "#64C4FF",
  SAR: "#64C4FF",
  BOT: "#52E252",
  ZHO: "#52E252",
  MAG: "#B6BABD",
  HUL: "#B6BABD",
  TSU: "#6692FF",
  RIC: "#6692FF",
  VET: "#229971",
  RAI: "#B6BABD",
  GRO: "#B6BABD",
  KVY: "#6692FF",
  LAT: "#64C4FF",
  MSC: "#B6BABD",
  GIO: "#52E252",
};

const formatLapTime = (ms: number) => {
  if (!ms || ms <= 0) return "--:--.---";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.round(ms % 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
};

const CustomTooltip = ({ active, payload, label, focus }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-pit-dark border border-pit-border p-4 font-display text-xs shadow-2xl backdrop-blur-md bg-opacity-95 min-w-[200px]">
        <p className="text-f1-white mb-2 border-b border-pit-border pb-1">
          {focus === "dist" ? `PACE: ${label}` : `LAP ${label}`}
        </p>
        <div className="flex flex-col gap-2">
          {payload.map((entry: any) => {
            const lapData = entry.payload.rawData?.[entry.dataKey];
            return (
              <div
                key={entry.dataKey}
                className="flex flex-col gap-1 border-b border-pit-border/30 pb-1 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 ${lapData?.is_personal_best ? "bg-green-500" : "bg-red-600"}`}
                      title={
                        lapData?.is_personal_best
                          ? "Personal Best"
                          : "No Personal Best"
                      }
                    ></div>
                    <span style={{ color: entry.color }} className="font-bold">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-f1-white font-mono">
                    {focus === "pace"
                      ? formatLapTime(entry.value)
                      : focus === "dist"
                        ? `${entry.value} Laps`
                        : `${entry.value} Laps Old`}
                  </span>
                </div>
                {lapData && focus !== "dist" && (
                  <div className="flex justify-between items-center pl-4 text-[9px] uppercase tracking-tighter opacity-70">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            TYRE_COLORS[lapData.compound?.toUpperCase()] ||
                            "#fff",
                        }}
                      ></div>
                      <span>{lapData.compound}</span>
                    </div>
                    <span>Life: {lapData.tyre_life}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

function OnboardingModal({
  onComplete,
}: {
  onComplete: (themeId: string, focus: string) => void;
}) {
  const [theme, setTheme] = useState("default");
  const [focus, setFocus] = useState("pace");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-pit-panel border border-pit-border p-8 max-w-2xl w-full flex flex-col gap-8 shadow-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-f1-red"></div>
            <p className="text-f1-red font-display tracking-widest text-xs uppercase">
              Welcome to Pit Wall
            </p>
          </div>
          <h2 className="text-4xl font-display font-bold tracking-tight uppercase">
            Personalize Your Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-display text-f1-gray tracking-widest uppercase">
              Select Your Identity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 border font-display text-[10px] uppercase tracking-widest transition-all ${
                    theme === t.id
                      ? "border-f1-white bg-f1-white/10"
                      : "border-pit-border hover:border-f1-gray"
                  }`}
                  style={{ borderColor: theme === t.id ? t.accent : "" }}
                >
                  <div
                    className="w-full h-1 mb-2"
                    style={{ backgroundColor: t.accent }}
                  ></div>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-xs font-display text-f1-gray tracking-widest uppercase">
              Select Your Focus
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setFocus("pace")}
                className={`p-4 border font-display text-[10px] uppercase tracking-widest text-left transition-all ${
                  focus === "pace"
                    ? "border-f1-white bg-f1-white/10"
                    : "border-pit-border hover:border-f1-gray"
                }`}
              >
                <p className="font-bold mb-1">Pace Analysis</p>
                <p className="text-[9px] opacity-60">
                  Lap times and relative performance.
                </p>
              </button>
              <button
                onClick={() => setFocus("dist")}
                className={`p-4 border font-display text-[10px] uppercase tracking-widest text-left transition-all ${
                  focus === "dist"
                    ? "border-f1-white bg-f1-white/10"
                    : "border-pit-border hover:border-f1-gray"
                }`}
              >
                <p className="font-bold mb-1">Pace Distribution</p>
                <p className="text-[9px] opacity-60">
                  Consistency and lap time spread.
                </p>
              </button>
              <button
                onClick={() => setFocus("tyre")}
                className={`p-4 border font-display text-[10px] uppercase tracking-widest text-left transition-all ${
                  focus === "tyre"
                    ? "border-f1-white bg-f1-white/10"
                    : "border-pit-border hover:border-f1-gray"
                }`}
              >
                <p className="font-bold mb-1">Tyre Strategy</p>
                <p className="text-[9px] opacity-60">
                  Degradation vs Tyre Age analysis.
                </p>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => onComplete(theme, focus)}
          className="w-full py-4 bg-f1-red text-f1-white font-display tracking-[0.3em] uppercase hover:bg-white hover:text-f1-red transition-all"
        >
          Initialize Dashboard →
        </button>
      </div>
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [sessions, setSessions] = useState<any[]>([]);
  const [laps, setLaps] = useState<any[]>([]);
  const [activeDrivers, setActiveDrivers] = useState<string[]>([]);
  const [maxLapTime, setMaxLapTime] = useState(120000);
  const [loading, setLoading] = useState(false);

  // Personalization state
  const [theme, setTheme] = useState<Theme | null>(null);
  const [focus, setFocus] = useState<string>("pace");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Playback state for Map
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [gridCollapsed, setGridCollapsed] = useState(true); // collapsed by default on mobile
  const [controlsCollapsed, setControlsCollapsed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedThemeId = localStorage.getItem("boxbox_theme");
    const savedFocus = localStorage.getItem("boxbox_focus");

    if (savedThemeId && THEMES[savedThemeId]) {
      setTheme(THEMES[savedThemeId]);
      setFocus(savedFocus || "pace");
    } else {
      setShowOnboarding(true);
    }

    fetch("/api/sessions")
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => setSessions(data || []))
      .catch((err) => console.error("Failed to fetch sessions:", err));
  }, []);

  const handleOnboardingComplete = (themeId: string, focusValue: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("boxbox_theme", themeId);
      localStorage.setItem("boxbox_focus", focusValue);
    }
    setTheme(THEMES[themeId]);
    setFocus(focusValue);
    setShowOnboarding(false);
  };

  useEffect(() => {
    if (sessionId) {
      setLoading(true);
      fetch(`/api/laps?session_id=${sessionId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setLaps(data || []);
          const drivers = Array.from(
            new Set((data || []).map((l: any) => l.driver)),
          ) as string[];
          setActiveDrivers(drivers);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch laps:", err);
          setLoading(false);
        });
    }
  }, [sessionId]);

  const chartData = useMemo(() => {
    if (focus === "dist") {
      const filteredLaps = laps.filter(
        (lap) => lap.lap_time_ms > 0 && lap.lap_time_ms <= maxLapTime,
      );
      if (filteredLaps.length === 0) return [];

      const min = Math.min(...filteredLaps.map((l) => l.lap_time_ms));
      const max = Math.max(...filteredLaps.map((l) => l.lap_time_ms));
      const binSize = 250; // 0.25s bins

      const bins: any[] = [];
      const startBin = Math.floor(min / binSize) * binSize;
      for (let b = startBin; b <= max; b += binSize) {
        bins.push({ bin: b, display: formatLapTime(b) });
      }

      const dataMap: Array<{ label: string; bin: number; [key: string]: any }> =
        bins.map((b) => ({
          label: b.display,
          bin: b.bin,
          ...activeDrivers.reduce((acc, d) => ({ ...acc, [d]: 0 }), {}),
        }));

      filteredLaps.forEach((lap) => {
        if (activeDrivers.includes(lap.driver)) {
          const binIndex = Math.floor((lap.lap_time_ms - startBin) / binSize);
          if (dataMap[binIndex]) {
            dataMap[binIndex][lap.driver]++;
          }
        }
      });
      return dataMap;
    }

    const filteredLaps = laps.filter(
      (lap) => lap.lap_time_ms > 0 && lap.lap_time_ms <= maxLapTime,
    );
    const map: any = {};
    filteredLaps.forEach((lap) => {
      if (!map[lap.lap_number])
        map[lap.lap_number] = { lap: lap.lap_number, rawData: {} };

      const value = focus === "pace" ? lap.lap_time_ms : lap.tyre_life;
      map[lap.lap_number][lap.driver] = value;
      map[lap.lap_number].rawData[lap.driver] = lap;
    });
    return Object.values(map).sort((a: any, b: any) => a.lap - b.lap);
  }, [laps, maxLapTime, focus, activeDrivers]);

  const driversInSession = useMemo(() => {
    return Array.from(new Set(laps.map((l: any) => l.driver))).sort();
  }, [laps]);

  const toggleDriver = (driver: string) => {
    setActiveDrivers((prev) =>
      prev.includes(driver)
        ? prev.filter((d) => d !== driver)
        : [...prev, driver],
    );
  };

  const selectAllDrivers = () => setActiveDrivers(driversInSession);
  const clearAllDrivers = () => setActiveDrivers([]);

  const currentSession = sessions.find((s) => s.id.toString() === sessionId);

  if (!sessionId) {
    return (
      <div className="flex-1 bg-pit-black text-f1-white flex flex-col items-center justify-center p-8 text-center">
        <div
          className="w-16 h-1 mb-6 animate-pulse"
          style={{ backgroundColor: theme?.accent || "#e8002d" }}
        ></div>
        <h2 className="text-2xl font-display font-bold mb-4 uppercase tracking-widest">
          No Session Selected
        </h2>
        <p className="text-f1-gray max-w-md mb-8">
          To view telemetry data, please select a session from the Seasons menu
          or use the quick selector below.
        </p>
        <select
          onChange={(e) =>
            router.push(`/dashboard?session_id=${e.target.value}`)
          }
          className="bg-pit-panel text-f1-white border border-pit-border px-6 py-3 font-display tracking-widest text-sm outline-none transition-colors"
          style={{ borderColor: theme?.accent ? `${theme.accent}33` : "" }}
        >
          <option value="">QUICK SELECT SESSION</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.year} {s.circuit} — {s.session_type}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden bg-pit-black text-f1-white">
      {" "}
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-pit-border bg-pit-panel p-4 md:p-6 overflow-y-auto flex flex-col gap-8 shadow-xl relative z-10">
        {" "}
        {/* Session Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme?.accent || "#e8002d" }}
            ></div>
            <span
              className="font-display text-[10px] tracking-widest uppercase"
              style={{ color: theme?.accent || "#e8002d" }}
            >
              Telemetria Active
            </span>
          </div>
          <h2 className="text-xl font-display font-bold tracking-tight uppercase leading-tight">
            {currentSession ? currentSession.circuit : "Loading Session..."}
          </h2>
          <p className="text-f1-gray text-[10px] font-display tracking-widest uppercase">
            {currentSession
              ? `${currentSession.year} • ${currentSession.session_type}`
              : "---"}
          </p>
        </div>
        <button
          onClick={() => setControlsCollapsed((prev) => !prev)}
          className="md:hidden w-full flex justify-between items-center py-2 border-t border-pit-border text-[10px] font-display text-f1-gray uppercase tracking-widest"
        >
          <span>Controls</span>
          <span>{controlsCollapsed ? "▼ SHOW" : "▲ HIDE"}</span>
        </button>
        <div
          className={`${controlsCollapsed ? "hidden" : "flex flex-col gap-8"} md:flex md:flex-col md:gap-8`}
        >
          {/* Focus Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase">
              Analysis Focus
            </label>
            <div className="flex border border-pit-border p-1 bg-pit-dark">
              {["pace", "dist", "tyre", "map"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFocus(f);
                    if (typeof window !== "undefined")
                      localStorage.setItem("boxbox_focus", f);
                  }}
                  className={`flex-1 py-2 text-[9px] font-display uppercase tracking-widest transition-all ${focus === f ? "bg-f1-white/10 text-f1-white" : "text-f1-gray hover:text-f1-white"}`}
                  style={{
                    backgroundColor: focus === f ? theme?.accentSoft : "",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {/* Map Controls */}
          {focus === "map" && (
            <div className="flex flex-col gap-4 p-4 border border-pit-border bg-pit-dark shadow-inner">
              <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase">
                Simulation Control
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 py-2 bg-f1-red text-f1-white font-display text-[10px] uppercase tracking-widest hover:bg-white hover:text-f1-red transition-all"
                >
                  {isPlaying ? "PAUSE ||" : "PLAY ►"}
                </button>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-pit-panel text-f1-white border border-pit-border px-2 py-2 font-display text-[9px] outline-none"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="5">5x</option>
                  <option value="10">10x</option>
                  <option value="50">50x</option>
                </select>
              </div>
            </div>
          )}
          {/* Outlier Filter */}
          {(focus === "pace" || focus === "dist") && (
            <div className="flex flex-col gap-4 p-4 border border-pit-border bg-pit-dark shadow-inner">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase">
                  Filter Threshold
                </label>
                <span
                  className="font-display text-[10px]"
                  style={{ color: theme?.accent || "#e8002d" }}
                >
                  {maxLapTime / 1000}S
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min="60000"
                  max="300000"
                  step="1000"
                  value={maxLapTime}
                  onChange={(e) => setMaxLapTime(parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: theme?.accent || "#e8002d" }}
                />
              </div>
            </div>
          )}
          {/* Driver Selection */}
          <div className="flex flex-col gap-4">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-default"
              onClick={() => setGridCollapsed((prev) => !prev)}
            >
              <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase cursor-pointer md:cursor-default">
                Grid Selection
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllDrivers}
                  className="text-[9px] font-display text-f1-gray hover:text-f1-white uppercase tracking-tighter transition-colors hidden md:block"
                >
                  All
                </button>
                <button
                  onClick={clearAllDrivers}
                  className="text-[9px] font-display text-f1-gray hover:text-f1-white uppercase tracking-tighter transition-colors hidden md:block"
                >
                  None
                </button>
                <span className="text-f1-gray text-xs md:hidden">
                  {gridCollapsed ? "▼" : "▲"}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={selectAllDrivers}
                  className="text-[9px] font-display text-f1-gray hover:text-f1-white uppercase tracking-tighter transition-colors"
                >
                  All
                </button>
                <button
                  onClick={clearAllDrivers}
                  className="text-[9px] font-display text-f1-gray hover:text-f1-white uppercase tracking-tighter transition-colors"
                >
                  None
                </button>
              </div>
            </div>
            <div
              className={`grid grid-cols-3 gap-1.5 ${gridCollapsed ? "hidden md:grid" : "grid"}`}
            >
              {" "}
              {driversInSession.map((driver) => (
                <button
                  key={driver}
                  onClick={() => toggleDriver(driver)}
                  style={{
                    borderColor: activeDrivers.includes(driver)
                      ? DRIVER_COLORS[driver] || "#ffffff"
                      : "#2a2a2a",
                    color: activeDrivers.includes(driver)
                      ? "#ffffff"
                      : "#4b5563",
                    backgroundColor: activeDrivers.includes(driver)
                      ? `${DRIVER_COLORS[driver]}1a`
                      : "transparent",
                  }}
                  className="px-1 py-2 text-[10px] font-display border transition-all duration-300 hover:border-f1-gray"
                >
                  {driver}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-pit-border flex justify-between items-center">
            <button
              onClick={() => router.push(`/season/${currentSession?.year}`)}
              className="text-[10px] font-display text-f1-gray hover:text-f1-white transition-colors flex items-center gap-2 uppercase tracking-widest"
            >
              ← Archive
            </button>
            <button
              onClick={() => setShowOnboarding(true)}
              className="text-f1-gray hover:text-f1-white transition-transform hover:rotate-90 duration-500"
              title="Personalization Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </aside>
      {/* Main Chart Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 overflow-y-auto md:overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-12 h-12 border-4 border-pit-border border-t-f1-red rounded-full animate-spin"
                style={{ borderTopColor: theme?.accent }}
              ></div>
              <p className="text-f1-gray font-display text-xs tracking-[0.2em] uppercase">
                Syncing Data...
              </p>
            </div>
          </div>
        ) : laps.length > 0 ? (
          <>
            <div className="flex justify-between items-end border-b border-pit-border pb-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-0.5"
                    style={{ backgroundColor: theme?.accent || "#e8002d" }}
                  ></div>
                  <h1 className="text-3xl font-display font-bold tracking-widest uppercase italic">
                    {focus === "pace"
                      ? "Lap performance"
                      : focus === "dist"
                        ? "Pace distribution"
                        : focus === "tyre"
                          ? "Tyre degradation"
                          : "Live Simulation"}
                  </h1>
                </div>
                <p className="text-f1-gray text-[10px] font-display uppercase tracking-[0.3em] pl-6 opacity-60">
                  {focus === "pace"
                    ? "Pace Analysis Telemetry"
                    : focus === "dist"
                      ? "Consistency & Spread Analysis"
                      : focus === "tyre"
                        ? "Tyre Compound & Life Analysis"
                        : "Real-time Track Positioning"}
                </p>
              </div>
              <div className="flex gap-10 text-right">
                <div className="flex flex-col gap-1">
                  <p className="text-f1-gray text-[9px] font-display uppercase tracking-widest">
                    Active Theme
                  </p>
                  <p
                    className="font-display text-xs uppercase"
                    style={{ color: theme?.accent || "#e8002d" }}
                  >
                    {theme?.name || "Boxbox Standard"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-f1-gray text-[9px] font-display uppercase tracking-widest">
                    Data Points
                  </p>
                  <p className="text-f1-white font-display text-xs">
                    {laps.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[400px] md:flex-1 md:h-auto bg-pit-panel/20 border border-pit-border p-6 shadow-2xl relative">
              {" "}
              {/* Theme accent corners */}
              <div
                className="absolute top-0 left-0 w-8 h-8 border-t border-l opacity-30"
                style={{ borderColor: theme?.accent }}
              ></div>
              <div
                className="absolute bottom-0 right-0 w-8 h-8 border-b border-r opacity-30"
                style={{ borderColor: theme?.accent }}
              ></div>
              <div className="bg-pit-dark border border-pit-border p-4 font-display text-xs shadow-2xl backdrop-blur-md bg-opacity-95 min-w-[150px] max-w-[200px]">
                {focus === "map" ? (
                  <TrackMap
                    circuit={currentSession?.circuit}
                    drivers={activeDrivers}
                    driverColors={DRIVER_COLORS}
                    laps={laps}
                    isPlaying={isPlaying}
                    playbackSpeed={playbackSpeed}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {focus === "dist" ? (
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid
                          strokeDasharray="1 1"
                          stroke="#222"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          stroke="#444"
                          fontSize={9}
                          tick={{ fontFamily: "var(--font-display)" }}
                        />
                        <YAxis
                          stroke="#444"
                          fontSize={10}
                          tick={{ fontFamily: "var(--font-display)" }}
                          label={{
                            value: "LAP COUNT",
                            angle: -90,
                            position: "insideLeft",
                            fill: "#444",
                            fontSize: 9,
                            fontFamily: "var(--font-display)",
                          }}
                        />
                        <Tooltip
                          content={<CustomTooltip focus={focus} />}
                          allowEscapeViewBox={{ x: false, y: false }}
                          position={{ x: 0, y: 0 }}
                        />
                        {activeDrivers.map((driver) => (
                          <Bar
                            key={driver}
                            dataKey={driver}
                            fill={DRIVER_COLORS[driver] || "#ffffff"}
                            stackId="a"
                            animationDuration={1500}
                          />
                        ))}
                      </BarChart>
                    ) : (
                      <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid
                          strokeDasharray="1 1"
                          stroke="#222"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="lap"
                          stroke="#444"
                          fontSize={10}
                          tick={{ fontFamily: "var(--font-display)" }}
                          label={{
                            value: "LAP",
                            position: "bottom",
                            offset: 0,
                            fill: "#444",
                            fontSize: 9,
                            fontFamily: "var(--font-display)",
                          }}
                        />
                        <YAxis
                          stroke="#444"
                          fontSize={10}
                          tick={{ fontFamily: "var(--font-display)" }}
                          tickFormatter={
                            focus === "pace" ? formatLapTime : (v) => `${v}L`
                          }
                          domain={["auto", "auto"]}
                          width={60}
                        />
                        <Tooltip
                          content={<CustomTooltip focus={focus} />}
                          allowEscapeViewBox={{ x: false, y: false }}
                          position={{ x: 0, y: 0 }}
                        />
                        {driversInSession
                          .filter((driver) => activeDrivers.includes(driver))
                          .map((driver) => (
                            <Line
                              key={driver}
                              type="monotone"
                              dataKey={driver}
                              stroke={DRIVER_COLORS[driver] || "#ffffff"}
                              strokeWidth={2.5}
                              dot={false}
                              activeDot={{
                                r: 5,
                                stroke: "#fff",
                                strokeWidth: 2,
                              }}
                              animationDuration={1500}
                            />
                          ))}
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-dashed border-pit-border rounded-lg bg-pit-panel/5">
            <p className="text-f1-gray font-display text-xs uppercase tracking-[0.3em] italic opacity-40">
              No Telemetry Signal Found
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 bg-pit-black flex items-center justify-center">
          <p className="text-f1-gray font-display tracking-widest uppercase animate-pulse">
            Establishing Connection...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
