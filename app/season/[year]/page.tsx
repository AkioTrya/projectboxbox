export default function SeasonPage({ params }: { params: { year: string } }) {
    return (
        <main className="flex-1 bg-pit-black text-f1-white p-8">
            <p className="text-f1-red font-display tracking-widest text-xs mb-2">
                SEASON
            </p>
            <h1 className="text-3xl font-display mb-8">
                {params.year} Championship
            </h1>
            <p className="text-f1-gray">Race data coming soon.</p>
        </main>
    )
}