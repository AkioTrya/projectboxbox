"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const seasons = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(2025);

    const handleSeason = (year: number) => {
        setSelectedSeason(year);
        setOpen(false);
        router.push(`/season/${year}`);
    };

    return (
        <nav className="border-b border-pit-border px-8 py-4 flex items-center gap-8 relative">
            {/* Logo */}
            <span className="text-f1-red font-display tracking-widest text-sm mr-4">
                BOXBOX
            </span>
            {/* Nav links */}
            <Link
                href="/"
                className={`text-sm font-display tracking-wider transition-colors ${pathname === "/" ? "text-f1-white" : "text-f1-gray hover:text-f1-white"
                    }`}>
                HOME
            </Link>
            <Link
                href="/dashboard"
                className={`text-sm font-display tracking-wider transition-colors ${pathname === "/dashboard" ? "text-f1-white" : "text-f1-gray hover:text-f1-white"
                    }`}>
                DASHBOARD
            </Link>
            <Link
                href="/teams"
                className={`text-sm font-display tracking-wider transition-colors ${pathname.startsWith("/teams") ? "text-f1-white" : "text-f1-gray hover:text-f1-white"
                    }`}>
                TEAMS
            </Link>
            <Link
                href="/newbie"
                className={`text-sm font-display tracking-wider transition-colors ${pathname.startsWith("/newbie") ? "text-f1-white" : "text-f1-gray hover:text-f1-white"
                    }`}>
                NEWBIE
            </Link>
            <Link
                href="/education"
                className={`text-sm font-display tracking-wider transition-colors ${pathname.startsWith("/education") ? "text-f1-white" : "text-f1-gray hover:text-f1-white"
                    }`}>
                EDUCATION
            </Link>
            {/* Season selector */}
            <div className="ml-auto relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 text-sm font-display tracking-widest border border-pit-border px-4 py-1.5 text-f1-white hover:border-f1-red transition-colors">
                    <span className="text-f1-red">●</span>
                    {selectedSeason} SEASON
                    <span className="text-f1-gray text-xs">{open ? "▲" : "▼"}</span>
                </button>
                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 top-full mt-1 w-40 border border-pit-border bg-pit-dark z-50">
                        {seasons.map((year) => (
                            <button
                                key={year}
                                onClick={() => handleSeason(year)}
                                className={`w-full text-left px-4 py-2 text-sm font-display tracking-widest transition-colors hover:bg-pit-panel ${selectedSeason === year ? "text-f1-red" : "text-f1-gray"
                                    }`}>
                                {year}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}