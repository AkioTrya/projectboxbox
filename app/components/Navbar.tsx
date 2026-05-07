"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const seasons = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/dashboard", label: "DASHBOARD" },
    { href: "/teams", label: "TEAMS" },
    { href: "/newbie", label: "NEWBIE" },
    { href: "/education", label: "EDUCATION" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(2025);

    const handleSeason = (year: number) => {
        setSelectedSeason(year);
        setOpen(false);
        router.push(`/season/${year}`);
    };

    return (
        <nav className="border-b border-pit-border px-4 md:px-8 py-4 relative">
            {/* Top row */}
            <div className="flex items-center gap-4 md:gap-8">
                {/* Logo */}
                <span className="text-f1-red font-display tracking-widest text-sm mr-2">
                    BOXBOX
                </span>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-display tracking-wider transition-colors ${
                                pathname === link.href || pathname.startsWith(link.href + "/")
                                    ? "text-f1-white"
                                    : "text-f1-gray hover:text-f1-white"
                            }`}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Season selector */}
                <div className="ml-auto relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 text-xs md:text-sm font-display tracking-widest border border-pit-border px-3 md:px-4 py-1.5 text-f1-white hover:border-f1-red transition-colors">
                        <span className="text-f1-red">●</span>
                        {selectedSeason}
                        <span className="hidden md:inline">SEASON</span>
                        <span className="text-f1-gray text-xs">{open ? "▲" : "▼"}</span>
                    </button>
                    {open && (
                        <div className="absolute right-0 top-full mt-1 w-40 border border-pit-border bg-pit-dark z-50">
                            {seasons.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => handleSeason(year)}
                                    className={`w-full text-left px-4 py-2 text-sm font-display tracking-widest transition-colors hover:bg-pit-panel ${
                                        selectedSeason === year ? "text-f1-red" : "text-f1-gray"
                                    }`}>
                                    {year}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hamburger - mobile only */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-1"
                >
                    <span className={`block w-5 h-0.5 bg-f1-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-f1-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-f1-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-1 pt-4 border-t border-pit-border mt-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm font-display tracking-wider py-2 transition-colors ${
                                pathname === link.href || pathname.startsWith(link.href + "/")
                                    ? "text-f1-white"
                                    : "text-f1-gray hover:text-f1-white"
                            }`}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}