import React from "react";

const educationTopics = [
    {
        title: "How to Read Lap Time Charts",
        content: "On a telemetry chart, the Y-axis represents time (lower is faster) and the X-axis represents lap numbers. Look for consistency in the line's height. Sudden spikes usually indicate a pit stop or a yellow flag period.",
        icon: "📈"
    },
    {
        title: "Identifying the 'Undercut'",
        content: "If a driver pits 1-2 laps before their rival and starts setting personal best sectors (watch for green/purple indicators), they are attempting an undercut. On our dashboard, you'll see their line drop significantly while the rival's line stays flat.",
        icon: "✂️"
    },
    {
        title: "Tyre Life vs. Pace",
        content: "As tyres age (Tyre Life increases), their grip decreases, leading to slower lap times. Switch the dashboard focus to 'Tyre' to see how many laps a compound has done and how it correlates with the pace drop-off.",
        icon: "🛞"
    },
    {
        title: "Syncing with Live Races",
        content: "While watching a live race, keep an eye on the gap between drivers. Use the 'Pace Distribution' view to see which driver has the better average speed. If one driver's distribution is shifted significantly left (faster) than the driver ahead, an overtake is likely imminent.",
        icon: "📺"
    }
];

export default function Education() {
    return (
        <main className="flex-1 bg-pit-black text-f1-white p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-f1-red"></div>
                        <p className="text-f1-red font-display tracking-widest text-xs uppercase">Telemetry Academy</p>
                    </div>
                    <h1 className="text-5xl font-display font-bold text-f1-white tracking-tight uppercase">
                        Mastering F1 Data
                    </h1>
                    <p className="text-f1-gray text-lg max-w-2xl mt-2 italic font-display">
                        "Telemetry is the heartbeat of the pit wall. Understanding it turns you from a spectator into a strategist."
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {educationTopics.map((topic, index) => (
                        <div 
                            key={index} 
                            className="bg-pit-panel border border-pit-border p-8 flex flex-col md:flex-row gap-6 hover:border-f1-red transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 text-8xl transition-opacity grayscale group-hover:grayscale-0">
                                {topic.icon}
                            </div>
                            <div className="flex-shrink-0 w-12 h-12 bg-pit-dark border border-pit-border flex items-center justify-center text-2xl group-hover:bg-f1-red/10 group-hover:border-f1-red transition-colors">
                                {topic.icon}
                            </div>
                            <div className="flex flex-col gap-3 relative z-10">
                                <h2 className="text-2xl font-display font-bold tracking-wide text-f1-white group-hover:text-f1-red transition-colors">
                                    {topic.title}
                                </h2>
                                <p className="text-f1-gray leading-relaxed font-body text-sm md:text-base">
                                    {topic.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 border-2 border-dashed border-pit-border bg-f1-red/5 flex flex-col gap-4 items-center text-center">
                    <p className="text-f1-white font-display text-lg">READY TO APPLY YOUR KNOWLEDGE?</p>
                    <p className="text-f1-gray text-sm max-w-lg">Head over to the Dashboard, select a historic session, and try to identify the winning strategy based on the telemetry data.</p>
                    <a 
                        href="/dashboard" 
                        className="mt-4 px-8 py-3 bg-f1-red text-f1-white font-display tracking-[0.2em] text-xs hover:bg-white hover:text-f1-red transition-all uppercase"
                    >
                        Go to Pit Wall →
                    </a>
                </div>
            </div>
        </main>
    );
}
