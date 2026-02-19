"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Scene from "@/components/Scene";

export default function Home() {
  const [mounted, setMounted] = useState(false);

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

      {/* High-End Interface Layer */}
      <div className={`fixed inset-0 z-10 flex flex-col items-center justify-between py-20 pointer-events-none transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* Intro Section - Top */}
        <div className="space-y-3 text-center page-content">
          <h2 className="text-white/30 font-rajdhani tracking-[0.5em] text-xs uppercase animate-pulse">Agency Hub</h2>
          <h1 className="text-5xl md:text-7xl font-bold font-rajdhani tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
            NEXTECH
          </h1>
          <div className="w-12 h-[1px] bg-white/20 mx-auto" />
          <p className="text-white/40 font-inter text-sm tracking-[0.2em] uppercase font-light">
            High-End Digital Engineering & Design
          </p>
        </div>

        {/* Global Navigation - Bottom */}
        <div className="flex flex-col items-center gap-12 pointer-events-auto w-full">
          <nav className="flex items-center justify-center gap-8 md:gap-16">
            <Link href="/works" className="group flex flex-col items-center gap-3 no-underline">
              <span className="text-xs font-rajdhani tracking-[0.3em] text-white/50 group-hover:text-white transition-all transform group-hover:-translate-y-1">PORTFOLIO</span>
              <div className="w-1 h-1 bg-white/20 rounded-full group-hover:w-8 group-hover:bg-white transition-all duration-500" />
            </Link>
            <Link href="/about" className="group flex flex-col items-center gap-3 no-underline">
              <span className="text-xs font-rajdhani tracking-[0.3em] text-white/50 group-hover:text-white transition-all transform group-hover:-translate-y-1">ABOUT WE</span>
              <div className="w-1 h-1 bg-white/20 rounded-full group-hover:w-8 group-hover:bg-white transition-all duration-500" />
            </Link>
            <Link href="/contact" className="group flex flex-col items-center gap-3 no-underline">
              <span className="text-xs font-rajdhani tracking-[0.3em] text-white/50 group-hover:text-white transition-all transform group-hover:-translate-y-1">CONTACT</span>
              <div className="w-1 h-1 bg-white/20 rounded-full group-hover:w-8 group-hover:bg-white transition-all duration-500" />
            </Link>
          </nav>
        </div>

      </div>

      {/* Visual Fade-out Overlay for Navigation */}
      <div className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-1000 opacity-0 [.navigating_&]:opacity-100" />
    </main>
  );
}
