import Link from "next/link";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-pit-black flex flex-col">
            <section className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-1 bg-f1-red"></div>
                    <p className="text-f1-red font-display tracking-widest text-xs">
                        Telemetry Analysis
                    </p>
                    <div className="w-8 h-1 bg-f1-red"></div>
                </div>
                <h1 className="text-6x1 font-display font-bold text-f1-white leading-tight tracking-tight mb-4">
                    PROJECT<br />BOXBOX
                </h1>
                <p className="text-f1-gray text-lg max-w-md">
                    Race data. Lap Analysis. Driver Telemetry. All in one pit wall.
                </p>
                <Link href="/dashboard"
                    className="mt-4 px-8 py-3 border border-f1-red text-f1-red font-display tracking-widest text-sm hover:bg-f1-red hover:text-f1-white transition-all duration-200">
                    ENTER PIT WALL
                </Link>
            </section>
            <div className="border-t border-pit-border px-8 py-4 flex justify-between items-center">
                <span className="text-f1-gray text-xs font-display">2025 SEASON</span>
                <span className="text-display-green text-xs font-display">LIVE DATA READY</span>
            </div>
        </main>
    )
}