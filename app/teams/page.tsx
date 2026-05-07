"use client";
import Link from "next/link";

<Link
    href="/"
    className="text-f1-gray hover:text-f1-white font-display text-[10px] uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors"
>
    ← Back
</Link>

const teams = [
  {
    name: "Red Bull Racing",
    slug: "red-bull",
    color: "#3671C6",
    accent: "#FFD700",
    founded: "2005",
    base: "Milton Keynes, UK",
    history:
      "Born from the Jaguar Racing team, Red Bull has become a dominant force in the hybrid era.",
  },
  {
    name: "Ferrari",
    slug: "ferrari",
    color: "#E8002D",
    accent: "#FFFFFF",
    founded: "1950",
    base: "Maranello, Italy",
    history:
      "The only team to have competed in every season of the Formula One World Championship.",
  },
  {
    name: "Mercedes",
    slug: "mercedes",
    color: "#00D2BE",
    accent: "#FFFFFF",
    founded: "1954",
    base: "Brackley, UK",
    history:
      "A heritage of engineering excellence, dominating the early turbo-hybrid era with 8 consecutive titles.",
  },
  {
    name: "McLaren",
    slug: "mclaren",
    color: "#FF8000",
    accent: "#FFFFFF",
    founded: "1963",
    base: "Woking, UK",
    history:
      "Founded by Bruce McLaren, it is the second oldest active team after Ferrari.",
  },
  {
    name: "Aston Martin",
    slug: "aston-martin",
    color: "#229971",
    accent: "#FFFFFF",
    founded: "1959",
    base: "Silverstone, UK",
    history:
      "Rebranded from Racing Point, carrying the legendary British Racing Green into the modern era.",
  },
  {
    name: "Alpine",
    slug: "alpine",
    color: "#0093CC",
    accent: "#FF87BC",
    founded: "1981",
    base: "Enstone, UK",
    history:
      "Formerly Renault and Toleman, Alpine represents the French sporting excellence in F1.",
  },
  {
    name: "Williams",
    slug: "williams",
    color: "#64C4FF",
    accent: "#FFFFFF",
    founded: "1977",
    base: "Grove, UK",
    history:
      "One of the most successful privateer teams in F1 history, founded by Sir Frank Williams.",
  },
  {
    name: "RB",
    slug: "rb",
    color: "#6692FF",
    accent: "#FFFFFF",
    founded: "1985",
    base: "Faenza, Italy",
    history:
      "Starting as Minardi, then Toro Rosso and AlphaTauri, it serves as Red Bull's talent pipeline.",
  },
  {
    name: "Kick Sauber",
    slug: "kick-sauber",
    color: "#52E252",
    accent: "#FFFFFF",
    founded: "1993",
    base: "Hinwil, Switzerland",
    history:
      "A Swiss-based team with deep engineering roots, currently transitioning into the Audi era.",
  },
  {
    name: "Haas",
    slug: "haas",
    color: "#B6BABD",
    accent: "#E8002D",
    founded: "2016",
    base: "Kannapolis, USA",
    history:
      "The only American team on the grid, utilizing a unique partnership model with Ferrari and Dallara.",
  },
];

export default function TeamsPage() {
  return (
    <main className="flex-1 bg-pit-black text-f1-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-f1-red"></div>
            <p className="text-f1-red font-display tracking-widest text-xs uppercase">
              Constructors
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-f1-gray hover:text-f1-white font-display text-[10px] uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-display font-bold text-f1-white tracking-tight uppercase">
            The 2025 Grid
          </h1>
          <p className="text-f1-gray text-lg max-w-2xl mt-2 font-display uppercase tracking-widest text-xs">
            10 Teams. 20 Drivers. One Championship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team.slug}
              className="group bg-pit-panel border border-pit-border p-8 hover:border-f1-red transition-all duration-300 flex flex-col gap-4 relative overflow-hidden shadow-lg"
            >
              {/* Color Bar */}
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: team.color }}
              ></div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-display font-bold tracking-wide group-hover:text-f1-red transition-colors uppercase">
                    {team.name}
                  </h3>
                  <p className="text-[10px] font-display text-f1-gray tracking-[0.2em] uppercase mt-1">
                    {team.base} • Since {team.founded}
                  </p>
                </div>
                <div
                  className="w-12 h-12 flex items-center justify-center border border-pit-border group-hover:border-f1-red transition-colors bg-pit-dark"
                  style={{ boxShadow: `4px 4px 0px ${team.color}` }}
                >
                  <span className="text-xs font-display font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                    {team.slug
                      .split("-")
                      .map((s) => s[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-f1-gray text-sm leading-relaxed mt-2 font-body max-w-md">
                {team.history}
              </p>

              <div className="mt-auto pt-6 border-t border-pit-border/50 flex justify-between items-center">
                <div className="flex gap-2">
                  <div
                    className="w-6 h-6 border border-pit-border"
                    style={{ backgroundColor: team.color }}
                    title="Primary Color"
                  ></div>
                  <div
                    className="w-6 h-6 border border-pit-border"
                    style={{ backgroundColor: team.accent }}
                    title="Accent Color"
                  ></div>
                </div>
                <a
                  href={`/teams/${team.slug}`}
                  className="text-[10px] font-display text-f1-red tracking-[0.2em] uppercase hover:text-f1-white transition-colors"
                >
                  View Full Profile →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
