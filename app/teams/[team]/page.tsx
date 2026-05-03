export default async function TeamPage({ params }: { params: Promise<{ team: string }> }) {
    const { team } = await params;

    return (
        <main className="flex-1 bg-pit-black text-f1-white flex flex-col items-center justify-center p-8 text-center">            <p className="text-f1-red font-display tracking-widest text-xs mb-2">TEAM</p>
            <h1 className="text-3xl font-display mb-4 uppercase">
                {team.replace(/-/g, " ")}
            </h1>
            <p className="text-f1-gray">Team profile coming soon.</p>
        </main>
    )
}