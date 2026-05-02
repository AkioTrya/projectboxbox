import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex-1 bg-pit-black text-f1-white p-8">
      <p className="text-f1-red font-display tracking-widest text-xs mb-2">
        DASHBOARD
      </p>
      <h1 className="text-3xl font-display mb-8">
        Race Analysis
      </h1>
      <p className="text-f1-gray">No session selected yet.</p>
    </main>
  )
}