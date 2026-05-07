"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface Point {
  x: number;
  y: number;
  dist: number;
}

interface DriverPosition {
  driver: string;
  color: string;
  lap: number;
  progress: number; // 0 to 1
  currentSector: number;
  s1?: number;
  s2?: number;
  s3?: number;
}

interface TrackMapProps {
  circuit: string;
  drivers: string[];
  driverColors: Record<string, string>;
  laps: any[];
  isPlaying: boolean;
  playbackSpeed: number;
  onLapComplete?: (driver: string, lapData: any) => void;
}

const TrackMap: React.FC<TrackMapProps> = ({
  circuit,
  drivers,
  driverColors,
  laps,
  isPlaying,
  playbackSpeed,
  onLapComplete,
}) => {
  const TYRE_COLORS: Record<string, string> = {
    SOFT: "#FF3333",
    MEDIUM: "#FFD700",
    HARD: "#FFFFFF",
    INTERMEDIATE: "#43B02A",
    WET: "#0067B9",
  };

  const [trackData, setTrackData] = useState<{
    points: Point[];
    sector_boundaries: any;
  } | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [pinchDist, setPinchDist] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(null);

  //
  const [expandedDrivers, setExpandedDrivers] = useState<Set<string>>(
    new Set(),
  );

  const toggleExpand = (driver: string) => {
    setExpandedDrivers((prev) => {
      const next = new Set(prev);
      if (next.has(driver)) next.delete(driver);
      else next.add(driver);
      return next;
    });
  };

  // Reset simulation when session changes
  useEffect(() => {
    setCurrentTime(0);
    previousTimeRef.current = null;
  }, [circuit, laps.length]);

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.5), 10));
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setPinchDist(Math.sqrt(dx * dx + dy * dy));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      setOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / pinchDist;
      setZoom((prev) => Math.min(Math.max(prev * scale, 0.5), 10));
      setPinchDist(dist);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Fetch track data
  useEffect(() => {
    if (!circuit) return;
    fetch(`/api/tracks?circuit=${encodeURIComponent(circuit)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.points) setTrackData(data);
      })
      .catch((err) => console.error("Failed to fetch track:", err));
  }, [circuit]);

  // Animation Loop
  const animate = (time: number) => {
    if (previousTimeRef.current !== null && isPlaying) {
      const deltaTime = time - previousTimeRef.current;
      setCurrentTime((prev) => prev + (deltaTime / 90000) * playbackSpeed);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Calculate path for SVG
  const pathData = useMemo(() => {
    if (!trackData) return "";
    const points = trackData.points;
    if (points.length === 0) return "";

    const minX = Math.min(...points.map((p) => p.x));
    const maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxY = Math.max(...points.map((p) => p.y));

    const trackWidth = maxX - minX;
    const trackHeight = maxY - minY;

    const padding = 25;
    const availableSize = 500 - padding * 2;
    const scale = availableSize / Math.max(trackWidth, trackHeight);

    const offsetX = (500 - trackWidth * scale) / 2;
    const offsetY = (500 - trackHeight * scale) / 2;

    const scaledPoints = points.map((p) => ({
      x: (p.x - minX) * scale + offsetX,
      y: (p.y - minY) * scale + offsetY,
    }));

    return (
      `M ${scaledPoints[0].x} ${scaledPoints[0].y} ` +
      scaledPoints
        .slice(1)
        .map((p) => `L ${p.x} ${p.y}`)
        .join(" ")
    );
  }, [trackData]);

  // Function to get XY at a specific progress (0-1)
  const getXYAtProgress = (progress: number) => {
    if (!trackData) return { x: 0, y: 0 };
    const points = trackData.points;
    if (points.length === 0) return { x: 0, y: 0 };

    const totalDist = points[points.length - 1].dist;
    const targetDist = Math.max(0, Math.min(progress, 1)) * totalDist;

    let startIdx = 0;
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].dist <= targetDist && points[i + 1].dist >= targetDist) {
        startIdx = i;
        break;
      }
    }

    const p1 = points[startIdx];
    const p2 = points[startIdx + 1] || p1;
    const distDiff = p2.dist - p1.dist;
    const segmentProgress =
      distDiff === 0 ? 0 : (targetDist - p1.dist) / distDiff;

    const rawX = p1.x + (p2.x - p1.x) * segmentProgress;
    const rawY = p1.y + (p2.y - p1.y) * segmentProgress;

    const minX = Math.min(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxX = Math.max(...points.map((p) => p.x));
    const maxY = Math.max(...points.map((p) => p.y));

    const trackWidth = maxX - minX;
    const trackHeight = maxY - minY;
    const scale = (500 - 50) / Math.max(trackWidth, trackHeight);

    const offsetX = (500 - trackWidth * scale) / 2;
    const offsetY = (500 - trackHeight * scale) / 2;

    return {
      x: (rawX - minX) * scale + offsetX,
      y: (rawY - minY) * scale + offsetY,
    };
  };

  // Calculate driver positions
  const driverPositions = useMemo(() => {
    if (!trackData || laps.length === 0) return [];

    const positions = drivers
      .map((driver) => {
        const driverLaps = laps
          .filter((l) => l.driver === driver)
          .sort((a, b) => a.lap_number - b.lap_number);
        if (driverLaps.length === 0) return null;

        let lapProgress = 0;
        const lapIndex = Math.min(
          Math.floor(currentTime),
          driverLaps.length - 1,
        );
        let currentLap = driverLaps[lapIndex];
        lapProgress = currentTime % 1;

        const prevLap = driverLaps[lapIndex - 1];
        const isPitting = prevLap && currentLap.tyre_life < prevLap.tyre_life;

        let sector = 1;
        if (currentLap.s1_ms && currentLap.lap_time_ms) {
          const s1_frac = currentLap.s1_ms / currentLap.lap_time_ms;
          const s2_frac =
            (currentLap.s1_ms + currentLap.s2_ms) / currentLap.lap_time_ms;
          if (lapProgress < s2_frac) sector = 2;
          else sector = 3;
        }

        const pos = getXYAtProgress(lapProgress);

        return {
          driver,
          isPitting,
          team: currentLap.team,
          color: driverColors[driver] || "#fff",
          x: pos.x,
          y: pos.y,
          lap: currentLap.lap_number,
          totalProgress: currentLap.lap_number + lapProgress,
          progress: lapProgress,
          sector,
          s1: currentLap.s1_ms,
          s2: currentLap.s2_ms,
          s3: currentLap.s3_ms,
          compound: currentLap.compound,
          tyre_life: currentLap.tyre_life,
          allLaps: driverLaps,
        };
      })
      .filter((p) => p !== null) as any[];

    const sorted = positions.sort((a, b) => b.totalProgress - a.totalProgress);
    const leaderProgress = sorted[0]?.totalProgress || 0;

    return sorted.map((p) => ({
      ...p,
      gap: Math.max(0, (leaderProgress - p.totalProgress) * 90),
    }));
  }, [trackData, laps, currentTime, drivers, driverColors]);

  const focusedDriver = useMemo(() => {
    return driverPositions.find((p) => p.driver === selectedDriver);
  }, [driverPositions, selectedDriver]);

  // Effect to auto-pan to selected driver
  useEffect(() => {
    if (focusedDriver && isPlaying) {
      // Smoothly move offset to center the driver
      // setOffset({ x: 250 - focusedDriver.x * zoom, y: 250 - focusedDriver.y * zoom });
    }
  }, [focusedDriver, isPlaying]);

  if (!trackData)
    return (
      <div className="flex items-center justify-center h-full text-f1-gray animate-pulse font-display text-xs">
        INITIALIZING TRACK TELEMETRY...
      </div>
    );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col overflow-hidden cursor-${isDragging ? "grabbing" : "grab"}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 relative">
        <svg viewBox="0 0 500 500" className="w-full h-full">
          {/* Track group - rotates */}
          <g
            transform={`translate(${offset.x}, ${offset.y}) scale(${zoom}) rotate(${rotation}, 250, 250)`}
          >
            <path
              d={pathData}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={pathData}
              fill="none"
              stroke="#222"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={pathData}
              fill="none"
              stroke="#444"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </g>

          {/* Driver group - follows rotated coordinates but labels stay upright */}
          <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
            {driverPositions.map((pos) => {
              // Rotate pos.x and pos.y around center (250,250)
              const rad = (rotation * Math.PI) / 180;
              const cx = 250,
                cy = 250;
              const rx =
                Math.cos(rad) * (pos.x - cx) -
                Math.sin(rad) * (pos.y - cy) +
                cx;
              const ry =
                Math.sin(rad) * (pos.x - cx) +
                Math.cos(rad) * (pos.y - cy) +
                cy;

              return (
                <g
                  key={pos.driver}
                  transform={`translate(${rx}, ${ry})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDriver(pos.driver);
                  }}
                >
                  <circle
                    r={
                      selectedDriver === pos.driver
                        ? 10 / Math.sqrt(zoom)
                        : 6 / Math.sqrt(zoom)
                    }
                    fill={pos.color}
                    className={
                      selectedDriver === pos.driver ? "" : "animate-pulse"
                    }
                    style={{
                      filter: `drop-shadow(0 0 ${8 / zoom}px ${pos.color})`,
                      stroke: selectedDriver === pos.driver ? "white" : "none",
                      strokeWidth: 2 / zoom,
                    }}
                  />
                  {pos.isPitting && (
                    <polygon
                      points={`0,${-20 / zoom} ${8 / zoom},${-8 / zoom} ${-8 / zoom},${-8 / zoom}`}
                      fill="#FFD700"
                      style={{
                        filter: `drop-shadow(0 0 ${6 / zoom}px #FFD700)`,
                      }}
                    />
                  )}
                  <text
                    y={-12 / zoom}
                    textAnchor="middle"
                    fill="white"
                    className="font-display font-bold"
                    style={{
                      fontSize: "8px",
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {pos.driver}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={handleRotate}
          className="bg-pit-dark/80 backdrop-blur-md border border-pit-border px-3 py-1 text-[10px] font-display text-f1-white uppercase tracking-widest hover:border-f1-red transition-colors"
        >
          ↻ ROTATE
        </button>
        {selectedDriver && (
          <button
            onClick={() => setSelectedDriver(null)}
            className="bg-f1-red/80 backdrop-blur-md border border-f1-red px-3 py-1 text-[10px] font-display text-f1-white uppercase tracking-widest hover:bg-f1-red"
          >
            Reset Focus
          </button>
        )}
        <div className="bg-pit-dark/80 backdrop-blur-md border border-pit-border px-3 py-1 text-[10px] font-display text-f1-white uppercase tracking-widest">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Focused Driver Detail Panel */}
      {focusedDriver && (
        <div className="absolute top-4 left-4 bottom-4 w-72 bg-pit-black/90 backdrop-blur-2xl border border-pit-border/50 p-5 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-left duration-500 z-50">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] text-f1-gray font-display font-bold tracking-widest uppercase">
                {focusedDriver.team}
              </span>
              <h2
                className="text-3xl font-display font-black tracking-tighter italic"
                style={{ color: focusedDriver.color }}
              >
                {focusedDriver.driver}
              </h2>
            </div>
            <button
              onClick={() => setSelectedDriver(null)}
              className="text-f1-gray hover:text-f1-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pit-dark/50 p-3 border border-pit-border/30 rounded-sm">
              <span className="text-[8px] text-f1-gray uppercase font-display block mb-1">
                Current Lap
              </span>
              <span className="text-xl font-mono font-bold">
                {focusedDriver.lap}
              </span>
            </div>
            <div className="bg-pit-dark/50 p-3 border border-pit-border/30 rounded-sm">
              <span className="text-[8px] text-f1-gray uppercase font-display block mb-1">
                Tyre Strategy
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      TYRE_COLORS[focusedDriver.compound?.toUpperCase()] ||
                      "#555",
                  }}
                ></div>
                <span className="text-lg font-mono font-bold">
                  {focusedDriver.compound?.charAt(0)}
                  {focusedDriver.tyre_life}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-f1-gray uppercase font-display tracking-widest font-bold">
              Stint History
            </span>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {focusedDriver.allLaps
                .slice(0, focusedDriver.lap)
                .reverse()
                .map((l: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[10px] font-mono p-1.5 border-b border-pit-border/20"
                  >
                    <span className="text-f1-gray">L{l.lap_number}</span>
                    <span
                      className={
                        l.is_personal_best ? "text-f1-purple" : "text-f1-white"
                      }
                    >
                      {(l.lap_time_ms / 1000).toFixed(3)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-pit-border/30">
            <div className="flex justify-between items-center text-[10px] uppercase font-display text-f1-gray mb-2">
              <span>Sector Performance</span>
              <span className="text-f1-white">
                {(focusedDriver.progress * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-pit-border/20 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${focusedDriver.progress * 100}%`,
                  backgroundColor: focusedDriver.color,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Full Grid Timing Overlay */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[35%] overflow-y-auto bg-pit-black/60 backdrop-blur-xl border-t border-pit-border/50 p-4 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {driverPositions.map((pos, idx) => {
            return (
              <div
                key={pos.driver}
                onClick={() => {
                  setSelectedDriver(pos.driver);
                  toggleExpand(pos.driver);
                }}
                className={`bg-pit-dark/90 border p-2.5 flex flex-col gap-2 shadow-lg transition-all cursor-pointer ${selectedDriver === pos.driver ? "border-f1-white scale-[1.02] z-10 ring-1 ring-f1-white/20" : "border-pit-border/80 hover:border-f1-white/30"}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-f1-gray w-3">
                      {idx + 1}
                    </span>
                    <div
                      className="w-1 h-3.5 rounded-full"
                      style={{ backgroundColor: pos.color }}
                    ></div>
                    <span className="font-display font-bold text-xs uppercase tracking-wider">
                      {pos.driver}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{
                        backgroundColor:
                          TYRE_COLORS[pos.compound?.toUpperCase()] || "#555",
                      }}
                    ></div>
                    <span className="text-[10px] text-f1-gray font-display font-bold">
                      L{pos.lap}
                    </span>
                    <span
                      className="text-[10px] font-display"
                      style={{ color: idx === 0 ? "#52E252" : "inherit" }}
                    >
                      {idx === 0 ? "LEAD" : `+${pos.gap.toFixed(1)}s`}
                    </span>
                  </div>
                </div>

                {expandedDrivers.has(pos.driver) && (
                  <div className="flex flex-col gap-2 border-t border-pit-border/40 pt-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 2, 3].map((s) => {
                        const isCurrent = pos.sector === s;
                        const isDone = pos.sector > s;
                        const time =
                          s === 1 ? pos.s1 : s === 2 ? pos.s2 : pos.s3;
                        return (
                          <div key={s} className="flex flex-col gap-1">
                            <div className="h-1 bg-pit-border/30 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${isCurrent ? "opacity-100" : "opacity-40"}`}
                                style={{
                                  width: isDone
                                    ? "100%"
                                    : isCurrent
                                      ? `${((pos.progress % 0.33) / 0.33) * 100}%`
                                      : "0%",
                                  backgroundColor: isDone
                                    ? "#52E252"
                                    : isCurrent
                                      ? pos.color
                                      : "transparent",
                                }}
                              ></div>
                            </div>
                            <div className="font-mono text-[9px] text-f1-white font-bold text-center">
                              {isDone
                                ? time
                                  ? (time / 1000).toFixed(2)
                                  : "--.--"
                                : isCurrent
                                  ? "RUN"
                                  : "--.--"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-[8px] font-display uppercase tracking-widest text-f1-gray/60">
                      TYRE: {pos.tyre_life || "0"}L
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackMap;
