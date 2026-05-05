"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Circuit {
    circuit_name: string;
    session_count: number;
    first_year: number;
    latest_year: number;
    country?: string;
}

export default function CircuitsPage() {
    const [circuits, setCircuits] = useState<Circuit[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/circuits')
            .then(res => res.json())
            .then(data => {
                setCircuits(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch circuits:', err);
                setLoading(false);
            });
    }, []);

    const filteredCircuits = circuits.filter(c =>
        c.circuit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <main className="min-h-screen bg-pit-black text-f1-white p-8">
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-pit-border border-t-f1-red rounded-full animate-spin"></div>
                        <p className="text-f1-gray font-display text-xs tracking-[0.2em] uppercase">Loading Circuits...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-pit-black text-f1-white">
            {/* Header */}
            <header className="border-b border-pit-border/50 bg-pit-panel/30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-1 bg-f1-red"></div>
                            <p className="text-f1-red font-display tracking-widest text-xs uppercase">Circuit Map Viewer</p>
                        </div>
                        <h1 className="text-5xl font-display font-bold tracking-tight">
                            RACE CIRCUITS
                        </h1>
                        <p className="text-f1-gray text-lg max-w-md">
                            Explore track maps, layouts, and telemetry data from all F1 circuits in our database.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search circuits by name or country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-pit-dark border border-pit-border px-4 py-3 text-f1-white font-display placeholder:text-f1-gray focus:outline-none focus:border-f1-red transition-colors"
                        />
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 border border-f1-gray text-f1-gray font-display tracking-widest text-sm hover:bg-f1-gray hover:text-pit-black transition-all duration-200"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Map Data Info */}
            <div className="max-w-7xl mx-auto px-8 mb-8 p-4 bg-pit-dark border border-pit-border/30 rounded">
                <div className="flex items-center gap-3 text-[10px] font-display uppercase tracking-widest">
                    <div className="w-2 h-2 bg-f1-red rounded-full"></div>
                    <p className="text-f1-gray">
                        <span className="text-f1-white font-bold">Map Data Available:</span> Only Bahrain currently has track map data. Other circuits will display session data and driver information.
                    </p>
                </div>
            </div>

            {/* Circuits Grid */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {filteredCircuits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCircuits.map((circuit) => (
                            <Link
                                key={circuit.circuit_name}
                                href={`/circuits/${encodeURIComponent(circuit.circuit_name)}`}
                                className="group bg-pit-panel border border-pit-border p-6 hover:border-f1-red transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl font-display font-bold italic">{circuit.circuit_name.charAt(0)}</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-f1-red font-display text-[10px] tracking-[0.2em] mb-1 flex items-center gap-2">
                                        MAP DATA {circuit.circuit_name === 'Bahrain' ? <span className="text-f1-white">✓</span> : <span className="text-f1-gray">○</span>}
                                    </div>
                                    <h3 className="text-xl font-display font-bold tracking-wide group-hover:text-f1-red transition-colors">
                                        {circuit.circuit_name}
                                    </h3>
                                    <p className="text-f1-gray text-xs font-display tracking-widest mt-1 uppercase">
                                        {circuit.country || 'Unknown Country'}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-pit-border group-hover:border-f1-red/30 flex justify-between items-center transition-colors">
                                    <span className="text-[10px] font-display text-f1-gray tracking-widest uppercase">
                                        {circuit.session_count} Session{circuit.session_count !== 1 ? 's' : ''}
                                    </span>
                                    <span className="text-f1-red text-xs font-display">VIEW →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-pit-panel border border-dashed border-pit-border">
                        <p className="text-f1-gray font-display tracking-widest uppercase mb-4">No circuits found matching "{searchTerm}"</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-2 border border-pit-border text-f1-gray hover:border-f1-red hover:text-f1-red transition-colors font-display text-sm uppercase tracking-widest"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Stats Footer */}
                <div className="mt-12 pt-8 border-t border-pit-border flex justify-between text-sm text-f1-gray font-display tracking-widest uppercase">
                    <p>Total Circuits: <span className="text-f1-white font-bold">{circuits.length}</span></p>
                    <p>Visible: <span className="text-f1-white font-bold">{filteredCircuits.length}</span></p>
                </div>
            </div>
        </main>
    );
}
