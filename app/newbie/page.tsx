import React from "react";

const terms = [
    { term: "DRS", abbr: "Drag Reduction System", description: "An adjustable flap on the rear wing that reduces aerodynamic drag, increasing top speed to aid overtaking." },
    { term: "Paddock", abbr: "", description: "The enclosed area behind the pit lane where teams keep their motorhomes, equipment, and VIP guests." },
    { term: "Pit Stop", abbr: "", description: "A stop in the pit lane where a team's mechanics change tires and make minor aerodynamic adjustments." },
    { term: "Box", abbr: "Boxbox", description: "A radio message from the team to the driver, instructing them to enter the pit lane for a pit stop." },
    { term: "Dirty Air", abbr: "", description: "Turbulent air left in the wake of a leading car, making it harder for the following car to generate downforce and maintain grip." },
    { term: "Clean Air", abbr: "", description: "Smooth, undisturbed airflow experienced by a car running alone on the track, offering optimal aerodynamic performance." },
    { term: "Undercut", abbr: "", description: "A strategy where a trailing driver pits earlier than the car ahead, using fresh tires to set faster lap times and jump ahead when the leader pits." },
    { term: "Overcut", abbr: "", description: "A strategy where a driver stays out longer on old tires, hoping the driver who pitted earlier gets held up by traffic, allowing them to jump ahead after their own pit stop." },
    { term: "Safety Car", abbr: "SC", description: "A car deployed to slow down the pack and control the pace during a dangerous situation on track." },
    { term: "Virtual Safety Car", abbr: "VSC", description: "A system used to slow cars to a mandated minimum speed without deploying a physical Safety Car, usually for minor incidents." },
    { term: "Slipstream", abbr: "Tow", description: "When a following car drives in the low-pressure area created by the leading car, reducing drag and gaining straight-line speed." },
    { term: "Pole Position", abbr: "", description: "The first position on the starting grid, awarded to the fastest driver in qualifying." },
    { term: "Apex", abbr: "", description: "The innermost point of a corner, where the driver aims to get the car closest to the inside edge of the track." },
    { term: "Halo", abbr: "", description: "A titanium structure placed above the cockpit to protect the driver's head from flying debris and impacts." },
    { term: "Parc Fermé", abbr: "", description: "A secure area where cars are kept after qualifying and the race, during which teams are forbidden from making unauthorized changes." },
];

export default function Newbie() {
    return (
        <main className="flex-1 bg-pit-black text-f1-white p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-f1-red"></div>
                        <p className="text-f1-red font-display tracking-widest text-xs">F1 101</p>
                    </div>
                    <h1 className="text-5xl font-display font-bold text-f1-white tracking-tight uppercase">
                        Newbie Glossary
                    </h1>
                    <p className="text-f1-gray text-lg max-w-2xl mt-2">
                        Get up to speed with the essential F1 terminology. Understand the radio calls, the strategies, and the technical jargon used on the pit wall.
                    </p>
                </div>

                {/* Terms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {terms.map((item, index) => (
                        <div
                            key={index}
                            className="bg-pit-panel border border-pit-border p-6 flex flex-col gap-3 hover:border-f1-red transition-colors duration-300 group"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-display font-bold tracking-wide text-f1-white group-hover:text-f1-red transition-colors">
                                    {item.term}
                                </h2>
                                {item.abbr && (
                                    <span className="text-xs font-display tracking-widest text-pit-border border border-pit-border px-2 py-1 rounded bg-pit-black">
                                        {item.abbr}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-f1-gray leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
