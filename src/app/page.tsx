"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Scene from "@/components/Scene";
import Intro from "@/components/Intro";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introActive, setIntroActive] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white selection:bg-white/10">
      {/* 3D Masterpiece Layer */}
      <div className="fixed inset-0 z-0">
        {mounted && (
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Cinematic Intro Overlay */}
      <Intro onComplete={() => setIntroActive(false)} />

      {/* High-End Interface Layer */}
      <div className={`fixed inset-0 z-10 flex flex-col items-center justify-between py-20 pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${mounted && !introActive ? 'opacity-100' : 'opacity-0'}`}>

        {/* Branding Section - Top (Simplified) */}
        <div className="space-y-2 text-center page-content">
          <h1 className="text-4xl md:text-6xl font-bold font-rajdhani tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
            NEXTECH
          </h1>
          <div className="w-8 h-[1px] bg-white/20 mx-auto" />
        </div>

        {/* Navigation Instructions - Bottom */}
        <div className="flex flex-col items-center gap-4 pointer-events-auto w-full">
          <p className="text-white/20 font-rajdhani text-[10px] tracking-[0.4em] uppercase transition-opacity duration-1000">
            Click on the orbs to navigate through the website
          </p>
          <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </div>

      </div>

      {/* Visual Fade-out Overlay for Navigation */}
      <div className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-1000 opacity-0 [.navigating_&]:opacity-100" />
    </main>
  );
}
