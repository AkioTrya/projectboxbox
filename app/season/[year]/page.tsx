"use client"

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Session {
    id: number;
    year: number;
    round: number;
    circuit: string;
    country: string;
    session_type: string;
    session_date: string;
}

export default function SeasonPage({ params }: { params: Promise<{ year: string }> }) {
    const { year } = use(params);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(data => {
                const yearSessions = data.filter((s: Session) => s.year.toString() === year);
                setSessions(yearSessions);
                setLoading(false);
            });
    }, [year]);

    return (
        <main className="flex-1 bg-pit-black text-f1-white p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-2 mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-f1-red"></div>
                        <p className="text-f1-red font-display tracking-widest text-xs uppercase">Championship Archive</p>
                    </div>
                    <h1 className="text-5xl font-display font-bold tracking-tight uppercase">
                        {year} Season
                    </h1>
                    <p className="text-f1-gray text-lg max-w-2xl mt-2">
                        Select a grand prix session to analyze detailed telemetry and lap-by-lap performance data.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-f1-red"></div>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sessions.map((session) => (
                            <Link
                                key={session.id}
                                href={`/dashboard?session_id=${session.id}`}
                                className="group bg-pit-panel border border-pit-border p-6 hover:border-f1-red transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl font-display font-bold italic">R{session.round}</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-f1-red font-display text-[10px] tracking-[0.2em] mb-1">
                                        ROUND {session.round} • {session.session_type}
                                    </div>
                                    <h3 className="text-xl font-display font-bold tracking-wide group-hover:text-f1-red transition-colors">
                                        {session.circuit}
                                    </h3>
                                    <p className="text-f1-gray text-xs font-display tracking-widest mt-1 uppercase">
                                        {session.country}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-pit-border group-hover:border-f1-red/30 flex justify-between items-center transition-colors">
                                    <span className="text-[10px] font-display text-f1-gray tracking-widest uppercase">
                                        {new Date(session.session_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="text-f1-red text-xs font-display">ANALYZE →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-pit-panel border border-dashed border-pit-border">
                        <p className="text-f1-gray font-display tracking-widest uppercase italic">No sessions found for this year.</p>
                    </div>
                )}
            </div>
        </main>
    );
}