"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const DRIVER_COLORS: Record<string, string> = {
    HAM: "#00D2BE", VER: "#3671C6", LEC: "#E8002D",
    SAI: "#E8002D", RUS: "#00D2BE", NOR: "#FF8000",
    PIA: "#FF8000", ALO: "#229971", STR: "#229971",
    PER: "#3671C6", GAS: "#0093CC", OCO: "#0093CC",
    ALB: "#64C4FF", SAR: "#64C4FF", BOT: "#52E252",
    ZHO: "#52E252", MAG: "#B6BABD", HUL: "#B6BABD",
    TSU: "#6692FF", RIC: "#6692FF", VET: "#229971",
    RAI: "#B6BABD", GRO: "#B6BABD", KVY: "#6692FF",
    LAT: "#64C4FF", MSC: "#B6BABD", NIO: "#52E252",
    GIO: "#52E252"
};
export default function Dashboard() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState<number | null>(null);
    const [laps, setLaps] = useState([]);

    const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = parseInt(e.target.value);
        setSelectedSession(id);
        fetch(`/api/laps?session_id=${id}`)
          .then(res => res.json())
          .then(data => setLaps(data));
};

    const buildChartData = (laps: any[]) => {
      const map: any = {};
      laps.forEach(lap => {
          if (!map[lap.lap_number]) map[lap.lap_number] = { lap: lap.lap_number };
          map[lap.lap_number][lap.driver] = lap.lap_time_ms;
      });
      return Object.values(map).sort((a: any, b: any) => a.lap - b.lap);
    };

    useEffect(() => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setSessions(data);
            });
    }, []);

    return (
    <main className="flex-1 bg-pit-black text-f1-white p-8">
        <p>Sessions loaded: {sessions.length}</p>
        <select onChange={handleSessionChange} className="bg-pit-panel text-f1-white border border-pit-border p-2 font-display">
            <option value="">SELECT SESSION</option>
            {sessions.map((s: any) => (
                <option key={s.id} value={s.id}>
                    {s.year} — {s.circuit}
                </option>
            ))}
        </select>
        <p>Laps loaded: {laps.length}</p>
        {laps.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={buildChartData(laps)}>
              <XAxis dataKey="lap" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              {Array.from(new Set(laps.map((l: any) => l.driver))).map((driver: any) => (
                  <Line 
                      key={driver}
                      type="monotone"
                      dataKey={driver}
                      dot={false}
                      strokeWidth={2}
                      stroke={DRIVER_COLORS[driver] || "#ffffff"}
                    />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}</main>
);
}