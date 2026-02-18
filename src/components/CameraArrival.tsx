"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

export default function CameraArrival() {
    const { camera } = useThree();
    const flashRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        if (!camera) return;

        const pCamera = camera as THREE.PerspectiveCamera;

        // Prepare camera for "Arrival" (Quantum Jump trajectory)
        const finalZ = camera.position.z;

        // Start from "inside" the jump - deep in the center, extreme warp
        camera.position.z = finalZ - 4; // Further back to feel the "slam"
        if (pCamera.fov) {
            pCamera.fov = 120; // High warp
            pCamera.updateProjectionMatrix();
        }

        // 1. THE FLASH-IN (Masking the Scene Start)
        if (flashRef.current) {
            gsap.to(flashRef.current, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.1
            });
        }

        // 2. THE SLAM (Decelerating into Position)
        const timeline = gsap.timeline();

        timeline.to(camera.position, {
            z: finalZ,
            duration: 1.8,
            ease: "expo.out"
        });

        if (pCamera.fov) {
            timeline.to(pCamera, {
                fov: 45,
                duration: 1.8,
                ease: "expo.out",
                onUpdate: () => pCamera.updateProjectionMatrix()
            }, 0);
        }

    }, [camera]);

    return (
        <Html fullscreen portal={undefined} zIndexRange={[100, 200]}>
            <div
                ref={flashRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'white',
                    opacity: 1,
                    pointerEvents: 'none',
                    zIndex: 9999
                }}
            />
        </Html>
    );
}
