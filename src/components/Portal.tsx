"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, MeshDistortMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface PortalProps {
    destination: string;
    label: string;
    color?: string;
    position?: [number, number, number];
    scale?: number;
    fontSize?: string;
    isSideLayout?: boolean;
    showCore?: boolean;
}

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>/?ABCDF0123456789";

export default function Portal({
    destination,
    label,
    color = "#ffffff",
    position = [0, 0, 0],
    scale = 1.5,
    fontSize = "2rem",
    isSideLayout = false,
    showCore = false
}: PortalProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const meshRef = useRef<THREE.Mesh>(null!); // This will now refer to the main liquid mesh
    const materialRef = useRef<any>(null!);
    const router = useRouter();
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    const [flash, setFlash] = useState(false);
    const flashRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        // Portal Emergence on Mount
        if (meshRef.current) {
            gsap.from(meshRef.current.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)",
                delay: 0.2
            });
        }
    }, []);

    // Interactive Distortion Sync
    useEffect(() => {
        if (materialRef.current && !active) {
            gsap.to(materialRef.current, {
                distort: hovered ? 0.35 : 0,
                speed: hovered ? 3 : 1.5,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    }, [hovered, active]);

    const { camera } = useThree();

    const handleClick = () => {
        if (active) return;
        setActive(true);
        const timeline = gsap.timeline();

        // 1. START NAVIGATION FLOW (UI Fade)
        document.body.classList.add('navigating');

        // 2. THE GLIDE (Move to Center of screen)
        // This makes the portal the "star" of the screen before the jump
        timeline.to(groupRef.current.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.8,
            ease: "power3.inOut"
        });

        // Start Flash early
        setFlash(true);

        // 3. THE SUBMERSION (Weighted Massive Expansion)
        // We start this slightly after the glide starts to feel "in progress"
        const expansionScale = 25;

        timeline.to(meshRef.current.scale, {
            x: expansionScale,
            y: expansionScale,
            z: expansionScale,
            duration: 1.8,
            ease: "expo.inOut"
        }, 0.5); // Start mid-glide

        // 4. MATERIAL CHURN RAMP-UP
        if (materialRef.current) {
            timeline.to(materialRef.current, {
                distort: 1.5,
                speed: 15,
                duration: 1.8,
                ease: "power2.in"
            }, 0.5);
        }

        // 5. THE DIVE (Phase 1)
        // Camera accelerates into the moving portal
        timeline.to(camera.position, {
            z: 0.2, // Aim deep into the center [0,0,0]
            duration: 1.5,
            ease: "power4.in"
        }, 0.6);

        // FOV Warp Distortion
        timeline.to(camera, {
            fov: 170,
            duration: 1.8,
            ease: "expo.in",
            onUpdate: () => camera.updateProjectionMatrix()
        }, 0.5);

        // 6. THE QUANTUM JUMP (Blinding White-out)
        if (flashRef.current) {
            timeline.to(flashRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.in"
            }, 1.4); // Peak flash matches the push
        }

        const navDelay = 2200; // Increased to account for glide + sequence
        setTimeout(() => {
            // Cleanup class before navigation
            document.body.classList.remove('navigating');
            router.push(destination);
        }, navDelay);
    };

    const coreRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        if (meshRef.current && !active) {
            meshRef.current.rotation.y += delta * 0.15;
            meshRef.current.rotation.z += delta * 0.1;
        }

        // High-Speed Core Rotation
        if (coreRef.current) {
            const speedFact = active ? 20 : (hovered ? 8 : 2);
            coreRef.current.rotation.x += delta * speedFact;
            coreRef.current.rotation.y += delta * (speedFact * 1.5);
            coreRef.current.rotation.z += delta * (speedFact * 0.5);

            // Core scale reacts to hover
            const targetScale = hovered ? 0.6 : 0.4;
            coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* THE INNER CORE (High-Tech Engine) */}
            {showCore && (
                <mesh ref={coreRef} scale={0.4}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color="white"
                        wireframe
                        emissive="white"
                        emissiveIntensity={8}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            )}

            {/* THE LIQUID METAL DROP (Pure Ferrofluid look) */}
            <mesh
                ref={meshRef}
                scale={scale}
                onPointerOver={() => !active && setHover(true)}
                onPointerOut={() => !active && setHover(false)}
                onClick={!active ? handleClick : undefined}
            >
                <icosahedronGeometry args={[1, 30]} /> {/* Higher detail for core */}
                <MeshDistortMaterial
                    ref={materialRef}
                    color={hovered ? "#ffffff" : "#eeeeee"}
                    envMapIntensity={1}
                    metalness={1}
                    roughness={0.02}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    distort={0}
                    speed={1.5}
                    transparent={showCore}
                    opacity={showCore ? 0.8 : 1}
                />
            </mesh>

            {/* Cinematic Flash-Out (Quantum Jump) */}
            {flash && (
                <Html fullscreen portal={undefined} zIndexRange={[100, 200]}>
                    <div
                        ref={flashRef}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'white',
                            opacity: 0,
                            pointerEvents: 'none',
                        }}
                    />
                </Html>
            )}

            {/* Label - Positioned UNDER the orb */}
            {label && (
                <Text
                    position={[0, -1.8, 0]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={hovered ? 1 : 0.4}
                >
                    {label.toUpperCase()}
                    <meshBasicMaterial transparent opacity={active ? 0 : (hovered ? 1 : 0.4)} />
                </Text>
            )}
        </group>
    );
}
