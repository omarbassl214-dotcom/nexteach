"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Stars, OrbitControls, Float, Environment } from "@react-three/drei";
// import { EffectComposer, Bloom } from "@react-three/postprocessing"; // Disabled for debug
import Portal from "./Portal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PageLayoutProps {
    title: string;
    children: React.ReactNode;
    nextPage: { label: string; offset: string };
    prevPage: { label: string; offset: string };
    color: string;
}

export default function PageLayout({ title, children, nextPage, prevPage, color }: PageLayoutProps) {
    return (
        <div className="relative w-full h-screen bg-black text-white overflow-hidden">

            {/* 3D Background & Next Portal */}
            <div className="absolute inset-0 z-0 opacity-50">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    {/* <EffectComposer>
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
            </EffectComposer> */}

                    <Stars radius={100} depth={50} count={2000} factor={4} fade />
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                        <Portal
                            destination={nextPage.offset}
                            label={`NEXT: ${nextPage.label}`}
                            position={[3, 0, -2]}
                            color={color}
                        />
                    </Float>
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-10 p-12 max-w-4xl h-full flex flex-col justify-center pointer-events-none">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pointer-events-auto"
                >
                    <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="mr-2" size={20} /> Return to Hub
                    </Link>

                    <h1 className="text-6xl font-bold mb-6" style={{ color: color, textShadow: `0 0 20px ${color}` }}>
                        {title}
                    </h1>

                    <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-lg leading-relaxed text-gray-200 shadow-2xl">
                        {children}
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-10 right-10 z-10 text-right pointer-events-none">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Next Destination</div>
                <div className="text-xl font-bold" style={{ textShadow: "0 0 10px white" }}>{nextPage.label} &rarr;</div>
                <div className="text-xs text-gray-600 mt-1">Look right to find the portal</div>
            </div>
        </div>
    );
}
