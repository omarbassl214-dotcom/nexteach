"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import WorldMap from "./WorldMap";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";

import { SCENE_POSITIONS } from "@/constants/scene";

function CameraDirector({ pathname }: { pathname: string }) {
    const { camera } = useThree();
    const lastPath = useRef(pathname);

    useEffect(() => {
        const targetPos = SCENE_POSITIONS[pathname as keyof typeof SCENE_POSITIONS] || [0, 0, 0];
        const isInitial = lastPath.current === pathname;

        // Singularity Flight Duration
        const duration = isInitial ? 0 : 2.0;

        if (!isInitial) {
            const timeline = gsap.timeline();

            // 1. Warp Flight
            timeline.to(camera.position, {
                x: targetPos[0],
                y: targetPos[1],
                z: targetPos[2] + 8,
                duration: duration,
                ease: "expo.inOut",
                onUpdate: () => {
                    // Gravitational Jitter
                    const intensity = timeline.progress() > 0.3 && timeline.progress() < 0.7 ? 0.1 : 0;
                    const jitterX = (Math.random() - 0.5) * intensity;
                    const jitterY = (Math.random() - 0.5) * intensity;
                    camera.lookAt(targetPos[0] + jitterX, targetPos[1] + jitterY, targetPos[2]);
                }
            });

            // 2. FOV Distortion (Space-Time Warp)
            timeline.to(camera, {
                fov: 110,
                duration: duration * 0.4,
                ease: "power4.in",
                onUpdate: () => camera.updateProjectionMatrix()
            }, 0);

            timeline.to(camera, {
                fov: 45,
                duration: duration * 0.6,
                ease: "expo.out",
                onUpdate: () => camera.updateProjectionMatrix()
            }, duration * 0.4);
        }

        lastPath.current = pathname;
    }, [pathname, camera]);

    return null;
}

export default function SceneWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isReforming = searchParams.get("reform") === "true";

    const onNavigate = (url: string) => {
        router.push(url);
    };

    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-0">
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    gl={{ antialias: false }}
                    dpr={[1, 2]}
                    style={{ pointerEvents: 'auto' }}
                >
                    <Suspense fallback={null}>
                        <color attach="background" args={["#050505"]} />

                        <Environment preset="studio" />
                        <ambientLight intensity={1.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                        <pointLight position={[-10, -5, -10]} intensity={2} color="#4444ff" />

                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color="red" />
                        </mesh>

                        <WorldMap onNavigate={onNavigate} isReforming={isReforming} />
                    </Suspense>
                </Canvas>
            </div>
            {children}
        </>
    );
}
