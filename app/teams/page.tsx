export default function TeamsPage() {
    const teams = [
        { name: "Red Bull Racing", slug: "red-bull", color: "#3671C6", accent: "#FFD700" },
        { name: "Ferrari", slug: "ferrari", color: "#E8002D", accent: "#FFFFFF" },
        { name: "Mercedes", slug: "mercedes", color: "#00D2BE", accent: "#FFFFFF" },
        { name: "McLaren", slug: "mclaren", color: "#FF8000", accent: "#FFFFFF" },
        { name: "Aston Martin", slug: "aston-martin", color: "#229971", accent: "#FFFFFF" },
        { name: "Alpine", slug: "alpine", color: "#0093CC", accent: "#FF87BC" },
        { name: "Williams", slug: "williams", color: "#64C4FF", accent: "#FFFFFF" },
        { name: "RB", slug: "rb", color: "#6692FF", accent: "#FFFFFF" },
        { name: "Kick Sauber", slug: "kick-sauber", color: "#52E252", accent: "#FFFFFF" },
        { name: "Haas", slug: "haas", color: "#B6BABD", accent: "#E8002D" },
    ];

    return (
        <main className="flex-1 bg-pit-black text-f1-white p-8">
            <p className="text-f1-red font-display tracking-widest text-xs mb-2">TEAMS</p>
            <h1 className="text-3xl font-display mb-8">2025 Constructors</h1>
            <div className="grid grid-cols-2 gap-4">
                {teams.map((team) => (
                    <a
                        key={team.slug}
                        href={`/teams/${team.slug}`}
                        className="border border-pit-border p-6 hover:border-f1-red transition-colors flex items-center gap-4">
                        <div className="w-1 h-12 rounded-full" style={{ backgroundColor: team.color }} />
                        <span className="font-display tracking-wider text-sm">{team.name}</span>
                    </a>
                ))}
            </div>
        </main >
    )
}