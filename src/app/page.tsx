"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "@/components/Scene";

export default function Home() {
  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase font-light pointer-events-none fade-in z-10">
        Select a Destination
      </div>
    </main>
  );
}
