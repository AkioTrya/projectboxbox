"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TrackMap from '@/app/components/TrackMap';

interface Circuit {
    circuit_name: string;
    session_count: number;
    first_year: number;
    latest_year: number;
    country?: string;
}

interface Session {
    id: number;
    year: number;
    round: number;
    circuit: string;
    country: string;
    session_type: string;
    session_date: string;
}

export default function CircuitViewPage() {
    const params = useParams();
    const circuitName = decodeURIComponent(params.circuit_name as string);

    const [circuit, setCircuit] = useState<Circuit | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [laps, setLaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDrivers, setActiveDrivers] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [headerExpanded, setHeaderExpanded] = useState(true);

    const DRIVER_COLORS: Record<string, string> = {
        HAM: "#00D2BE", VER: "#3671C6", LEC: "#E8002D",
        SAI: "#E8002D", RUS: "#00D2BE", NOR: "#FF8000",
        PIA: "#FF8000", ALO: "#229971", STR: "#229971",
        PER: "#3671C6", GAS: "#0093CC", OCO: "#0093CC",
        ALB: "#64C4FF", SAR: "#64C4FF", BOT: "#52E252",
        ZHO: "#52E252", MAG: "#B6BABD", HUL: "#B6BABD",
        TSU: "#6692FF", RIC: "#6692FF", VET: "#229971",
        RAI: "#B6BABD", GRO: "#B6BABD", KVY: "#6692FF",
        LAT: "#64C4FF", MSC: "#B6BABD", GIO: "#52E252"
    };

    // Fetch circuit info
    useEffect(() => {
        fetch('/api/circuits')
            .then(res => res.json())
            .then(data => {
                const found = data.find((c: Circuit) => c.circuit_name === circuitName);
                setCircuit(found || null);
            })
            .catch(err => console.error('Failed to fetch circuits:', err));
    }, [circuitName]);

    // Fetch sessions for this circuit
    useEffect(() => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter((s: Session) =>
                    s.circuit.toLowerCase() === circuitName.toLowerCase()
                );
                setSessions(filtered.sort((a, b) => b.year - a.year));
                if (filtered.length > 0) {
                    setSelectedSession(filtered[0]);
                }
            })
            .catch(err => console.error('Failed to fetch sessions:', err));
    }, [circuitName]);

    // Fetch laps when session changes
    useEffect(() => {
        if (!selectedSession) return;

        setLoading(true);
        fetch(`/api/laps?session_id=${selectedSession.id}`)
            .then(res => res.json())
            .then(data => {
                setLaps(data || []);
                const drivers = [...new Set(data.map((l: any) => l.driver))];
                setActiveDrivers(drivers);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch laps:', err);
                setLoading(false);
            });
    }, [selectedSession]);

    const toggleDriver = (driver: string) => {
        setActiveDrivers(prev =>
            prev.includes(driver) ? prev.filter(d => d !== driver) : [...prev, driver]
        );
    };

    return (
        <main className="min-h-screen bg-pit-black text-f1-white flex flex-col">
            {/* Header */}
            <header className="border-b border-pit-border/50 bg-pit-panel/30 backdrop-blur-md flex-shrink-0">
                <div className="max-w-7xl mx-auto px-8 py-2 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <h1 className="text-2xl font-display font-bold tracking-tight">
                                    {circuitName}
                                </h1>
                            </div>
                            <button
                                onClick={() => setHeaderExpanded(!headerExpanded)}
                                className="text-f1-gray hover:text-f1-white transition-colors px-3 py-1"
                                title={headerExpanded ? "Collapse header" : "Expand header"}
                            >
                                {headerExpanded ? "−" : "+"}
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats (always visible) */}
                    {circuit && (
                        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-f1-gray uppercase font-display tracking-widest">Sessions</span>
                                <span className="text-lg font-display font-bold text-f1-white">{circuit.session_count}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-f1-gray uppercase font-display tracking-widest">Years</span>
                                <span className="text-lg font-display font-bold text-f1-white">
                                    {circuit.first_year === circuit.latest_year ? circuit.latest_year : `${circuit.first_year}-${circuit.latest_year}`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Expanded Details */}
                {headerExpanded && (
                    <div className="border-t border-pit-border/30 px-8 py-3 bg-pit-dark/20 animate-in slide-in-from-top duration-200">
                        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-1 bg-f1-red"></div>
                                    <p className="text-f1-red font-display tracking-widest text-xs uppercase">{circuit?.country || 'Circuit'}</p>
                                </div>
                                <Link href="/circuits" className="flex items-center gap-2 text-f1-gray hover:text-f1-white transition-colors text-xs">
                                    <span>←</span>
                                    <span className="font-display uppercase tracking-widest">Back to Circuits</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto">
                    {/* Sidebar Controls */}
                    <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
                        {/* Session Selector */}
                        <div className="bg-pit-panel border border-pit-border p-4">
                            <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase block mb-3">
                                Select Session
                            </label>
                            <select
                                value={selectedSession?.id || ''}
                                onChange={(e) => {
                                    const session = sessions.find(s => s.id.toString() === e.target.value);
                                    setSelectedSession(session || null);
                                }}
                                className="w-full bg-pit-dark border border-pit-border px-3 py-2 text-f1-white font-display text-sm focus:outline-none focus:border-f1-red transition-colors"
                            >
                                <option value="">Select a session...</option>
                                {sessions.map(session => (
                                    <option key={session.id} value={session.id}>
                                        {session.year} {session.session_type} - {new Date(session.session_date).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Playback Controls */}
                    {selectedSession && laps.length > 0 && (
                        <div className="bg-pit-panel border border-pit-border p-4 flex flex-col gap-4">
                            <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase">
                                Playback Control
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
                                    className="bg-pit-dark text-f1-white border border-pit-border px-2 py-2 font-display text-[9px] outline-none"
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

                    {/* Driver Selection */}
                    {selectedSession && laps.length > 0 && (
                        <div className="bg-pit-panel border border-pit-border p-4 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase">
                                    Drivers ({activeDrivers.length})
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveDrivers([...new Set(laps.map((l: any) => l.driver))])}
                                        className="text-[9px] font-display text-f1-gray hover:text-f1-white uppercase tracking-tighter transition-colors"
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setActiveDrivers([])}
                                        className="text-[9px] font-display text-f1-gray hover:text-f1-white uppercase tracking-tighter transition-colors"
                                    >
                                        None
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                                {[...new Set(laps.map((l: any) => l.driver))].map((driver) => (
                                    <button
                                        key={driver}
                                        onClick={() => toggleDriver(driver as string)}
                                        style={{
                                            borderColor: activeDrivers.includes(driver as string) ? DRIVER_COLORS[driver as string] || '#ffffff' : '#2a2a2a',
                                            color: activeDrivers.includes(driver as string) ? '#ffffff' : '#4b5563',
                                            backgroundColor: activeDrivers.includes(driver as string) ? `${DRIVER_COLORS[driver as string]}1a` : 'transparent'
                                        }}
                                        className="px-2 py-2 text-[10px] font-display border transition-all duration-300 hover:border-f1-gray"
                                    >
                                        {driver}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sessions List */}
                    {sessions.length > 0 && (
                        <div className="bg-pit-panel border border-pit-border p-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
                            <label className="text-[10px] font-display font-bold text-f1-white tracking-widest uppercase">
                                All Sessions at {circuitName}
                            </label>
                            <div className="overflow-y-auto flex-1">
                                {sessions.map(session => (
                                    <button
                                        key={session.id}
                                        onClick={() => setSelectedSession(session)}
                                        className={`w-full text-left px-3 py-2 border-l-2 transition-all text-[10px] font-display tracking-wide mb-1 ${
                                            selectedSession?.id === session.id
                                                ? 'border-l-f1-red bg-pit-dark text-f1-white'
                                                : 'border-l-pit-border text-f1-gray hover:text-f1-white hover:border-l-f1-gray'
                                        }`}
                                    >
                                        <div className="font-bold">{session.year} {session.session_type}</div>
                                        <div className="text-[9px] opacity-60">{new Date(session.session_date).toLocaleDateString()}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Map Viewer */}
                <div className="flex-1 min-h-0 flex flex-col gap-4">
                    {/* Map Data Status */}
                    {circuitName !== 'Bahrain' && (
                        <div className="bg-pit-dark border border-pit-border/50 p-4 flex items-start gap-3">
                            <div className="text-f1-red text-lg mt-0.5">⚠</div>
                            <div className="flex-1 flex flex-col gap-1">
                                <p className="text-sm font-display font-bold text-f1-white">Track Map Not Available</p>
                                <p className="text-[10px] text-f1-gray font-display">
                                    Map data for {circuitName} is not yet in our database. Session telemetry data is available below. Currently, only Bahrain has track mapping data.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[700px] bg-pit-panel border border-pit-border flex-1">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-pit-border border-t-f1-red rounded-full animate-spin"></div>
                                <p className="text-f1-gray font-display text-xs tracking-[0.2em] uppercase">Loading Track Data...</p>
                            </div>
                        </div>
                    ) : selectedSession && laps.length > 0 ? (
                        <div className="bg-pit-panel border border-pit-border p-6 min-h-[700px] flex-1 relative overflow-hidden">
                            <TrackMap
                                circuit={circuitName}
                                drivers={activeDrivers}
                                driverColors={DRIVER_COLORS}
                                laps={laps}
                                isPlaying={isPlaying}
                                playbackSpeed={playbackSpeed}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center min-h-[700px] bg-pit-panel border border-pit-border text-center flex-1">
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-f1-gray font-display">No session data available</p>
                                <p className="text-[10px] text-pit-border">Please select a session to view the track map</p>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </main>
    );
}
