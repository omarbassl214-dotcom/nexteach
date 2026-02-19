"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroProps {
    onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Timeline for the intro
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for fade animation before calling onComplete
            setTimeout(onComplete, 1000);
        }, 3500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
                >
                    {/* Background Subtle Glow */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Shimmer Line Top */}
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 80, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-[1px] bg-white/20 mb-8"
                        />

                        {/* Agency Name */}
                        <div className="overflow-hidden mb-2">
                             <motion.h1
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="text-6xl md:text-8xl font-bold font-rajdhani tracking-[-0.05em] text-white"
                            >
                                NEXTECH
                            </motion.h1>
                        </div>

                        {/* Tagline */}
                        <div className="overflow-hidden">
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 0.5 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                className="text-xs md:text-sm font-rajdhani tracking-[0.6em] uppercase text-white/50"
                            >
                                Digital Engineering Agency
                            </motion.p>
                        </div>

                        {/* Shimmer Line Bottom */}
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 240, opacity: 1 }}
                            transition={{ duration: 2, delay: 0.8 }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mt-10"
                        />

                        {/* Loading Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                            className="absolute -bottom-20 flex flex-col items-center gap-2"
                        >
                            <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-rajdhani">Initializing Environment</span>
                        </motion.div>
                    </div>

                    {/* Corner Borders */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute inset-10 pointer-events-none"
                    >
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/10" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/10" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
