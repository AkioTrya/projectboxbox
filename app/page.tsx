"use client"

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [animating, setAnimating] = useState(true);
  const [done, setDone] = useState(false);
  const [fromBottom, setFromBottom] = useState(false);

  useEffect(() => {
    // Auto-finish animation after 2.2s
    const timer = setTimeout(() => {
      setDone(true);
      setTimeout(() => setAnimating(false), 600);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

    const replay = () => {
      setFromBottom(true);
      setAnimating(true);
      setDone(false);
      setTimeout(() => {
        setDone(true);
        setTimeout(() => {
          setAnimating(false);
          setFromBottom(false);
        }, 600);
      }, 1400);
    };

  const panels = [0, 1, 2, 3, 4];

  return (
    <main className="min-h-screen bg-pit-black overflow-hidden relative flex flex-col">

      {/* Intro panels */}
      {animating && (
        <div className="fixed inset-0 z-50 flex cursor-pointer"
            onClick={() => {
              setDone(true);
              setTimeout(() => setAnimating(false), 600);
            }}>
          {panels.map((i) => (
            <div
              key={i}
              className="flex-1 bg-pit-panel relative"
              style={{
                transform: done ? "translateY(-110%)" : fromBottom ? "translateY(110%)" : "translateY(0%)",
                transition: `transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)`,
                transitionDelay: `${i * 50}ms`,
                clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)",
              }}
            />
          ))}

          {/* Logo on top of panels */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{
              opacity: done ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-0.5 bg-f1-red"></div>
              <p className="text-f1-red font-display tracking-widest text-xs">F1 TELEMETRY</p>
              <div className="w-6 h-0.5 bg-f1-red"></div>
            </div>
            <h1 className="text-5xl font-display font-bold text-f1-white tracking-tight">
              BOXBOX
            </h1>
          </div>
        </div>
      )}

      {/* Hero */}
        <section
          className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 transition-all duration-700"
          style={{ filter: animating ? "blur(8px)" : "blur(0px)" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-f1-red"></div>
          <p className="text-f1-red font-display tracking-widest text-xs">F1 TELEMETRY</p>
          <div className="w-8 h-1 bg-f1-red"></div>
        </div>

        <h1 className="text-6xl font-display font-bold text-f1-white leading-tight">
          PROJECT
          <br/>
          BOXBOX
        </h1>

        <p className="text-f1-gray text-lg max-w-md">
          Race data. Lap analysis. Driver telemetry. All in one pit wall.
        </p>

        <Link
          href="/dashboard"
          className="mt-4 px-8 py-3 border border-f1-red text-f1-red font-display tracking-widest text-sm hover:bg-f1-red hover:text-f1-white transition-all duration-200"
        >
          ENTER PIT WALL →
        </Link>
      </section>

      {/* Bottom bar */}
      <div className="border-t border-pit-border px-8 py-4 flex justify-between items-center">
        <span className="text-f1-gray text-xs font-display">2026 SEASON</span>
        <div className="flex items-center gap-4">
          <button
            onClick={replay}
            className="text-f1-gray hover:text-f1-white text-xs font-display tracking-widest transition-colors"
          >
            ↺ REPLAY
          </button>
          <span className="text-display-green text-xs font-display">● LIVE DATA READY</span>
        </div>
      </div>

    </main>
  );
}