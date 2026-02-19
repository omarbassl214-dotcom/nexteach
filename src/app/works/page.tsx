"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import WorksScene from "@/components/WorksScene";

export default function Works() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const projects = [
        { title: "Luxurious Towing", desc: "High-End Automotive Service Platform", link: "#" },
        { title: "Perfect Protocol", desc: "Cybersecurity & Encryption Interface", link: "#" },
        { title: "Atmospheric Drop", desc: "Interactive 3D Weather Simulation", link: "#" },
    ];

    return (
        <main className="relative w-full h-screen overflow-hidden text-white">
            {mounted && <WorksScene />}

            <div className={`absolute inset-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'} pointer-events-none z-10 page-content`}>
                {/* Top Right Navigation */}
                <div className="absolute top-10 right-8 md:right-20 pointer-events-auto">
                    <Link href="/" className="group flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        <span className="block w-1.5 h-1.5 bg-white/30 group-hover:bg-white rounded-full transition-all group-hover:scale-125" />
                        Return to Hub
                    </Link>
                </div>

                <div className="flex items-start justify-start px-8 md:px-20 pt-10 h-full">
                    <div className="max-w-2xl w-full pointer-events-auto">
                        {/* Header - Top Left */}
                        <div className="space-y-2">
                            <h2 className="text-white/30 font-rajdhani tracking-[0.5em] text-[10px] uppercase">Portfolio</h2>
                            <h1 className="text-5xl md:text-7xl font-bold font-rajdhani tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                                SELECTED<br />WORKS
                            </h1>
                        </div>

                        <div className="mt-8 max-w-sm">
                            <p className="text-white/60 font-inter text-sm leading-relaxed">
                                A curated collection of digital experiences, focusing on high-end 3D interactions and minimalist aesthetics.
                            </p>
                            <div className="w-12 h-[1px] bg-white/20 mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
