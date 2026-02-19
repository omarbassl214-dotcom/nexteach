"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import AboutScene from "@/components/AboutScene";

export default function About() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main className="relative w-full h-screen overflow-hidden text-white">
            <AboutScene />

            <div className={`absolute inset-0 flex items-center justify-start px-8 md:px-20 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'} pointer-events-none z-10 page-content`}>

                {/* The Card ITSELF captures clicks for text selection/links */}
                <div className="max-w-2xl w-full pointer-events-auto">

                    {/* Navigation - High Tech Back Button */}
                    <Link href="/" className="group absolute top-10 left-8 md:left-20 flex items-center gap-2 text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                        <span className="block w-2 h-2 bg-white/50 group-hover:bg-white rounded-full transition-all group-hover:scale-125" />
                        Return to Hub
                    </Link>

                    {/* Header - The Monolith Typography */}
                    <h1 className="text-6xl md:text-8xl font-bold font-rajdhani mb-8 tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        WHO AM I?
                    </h1>

                    {/* Glass Card */}
                    <div className="relative p-8 md:p-10 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl">
                        {/* Decorative Tech Lines */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="space-y-6 text-lg md:text-xl font-light text-white/80 leading-relaxed font-inter">
                            <p>
                                With three years of dedicated experience in the digital landscape, <span className="text-white font-semibold glow">Nextech</span> is a full-service agency built on the intersection of creative design and robust engineering. We specialize in crafting high-end, full-stack solutions that translate complex ideas into seamless user experiences. Our mission is to provide our global partners—from the US to local markets—with the scalable digital infrastructure they need to stand out.
                            </p>
                            <p>
                                At Nextech, we don't just build websites; we <span className="text-white font-semibold">engineer digital destinations</span>. Every line of code and every interactive detail is driven by our commitment to precision, modern aesthetics, and high-performance results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - The Visual is handled by AboutScene */}
        </main>
    );
}
D
