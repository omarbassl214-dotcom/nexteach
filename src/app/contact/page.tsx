"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ContactScene from "@/components/ContactScene";

export default function Contact() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main className="relative w-full h-screen overflow-hidden text-white">
            {mounted && <ContactScene />}

            <div className={`absolute inset-0 flex items-center justify-start px-8 md:px-20 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'} pointer-events-none z-10 page-content`}>

                <div className="max-w-2xl w-full pointer-events-auto">

                    {/* Navigation */}
                    <Link href="/" className="group absolute top-10 left-8 md:left-20 flex items-center gap-2 text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                        <span className="block w-2 h-2 bg-white/50 group-hover:bg-white rounded-full transition-all group-hover:scale-125" />
                        Return to Hub
                    </Link>

                    {/* Header */}
                    <h1 className="text-6xl md:text-8xl font-bold font-rajdhani mb-8 tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        GET IN<br />TOUCH
                    </h1>

                    {/* Glass Card */}
                    <div className="relative p-8 md:p-10 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl">
                        {/* Tech Lines */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="space-y-8 font-inter text-center">
                            <div>
                                <p className="text-sm uppercase tracking-widest text-white/50 mb-2">Email Access</p>
                                <a href="mailto:agencynextech@gmail.com" className="text-2xl md:text-3xl font-bold text-white hover:text-blue-400 transition-colors">agencynextech@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
