import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface GalleryItemProps {
    title: string;
    desc: string;
    index: number;
    count: number;
    position: [number, number, number];
}

function ChromeOrb({ title, desc, index, count, position }: GalleryItemProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<any>(null!);
    const textGroupRef = useRef<THREE.Group>(null!);
    const [hovered, setHover] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    // Sync with global navigation state (UI Fade)
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsNavigating(document.body.classList.contains('navigating'));
                }
            });
        });

        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // Animate opacity during navigation
    useEffect(() => {
        if (isNavigating) {
            // Fade out
            if (materialRef.current) {
                gsap.to(materialRef.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" });
            }
            if (textGroupRef.current) {
                gsap.to(textGroupRef.current.position, { y: -0.2, duration: 0.8, ease: "power2.inOut" });
                // We'll also fade text in useFrame or via refs if needed, but simple group move + opacity is best
            }
        }
    }, [isNavigating]);

    // Floating animation offset
    const randomOffset = useMemo(() => Math.random() * 10, []);

    useFrame((state) => {
        // Gentle boiling
        if (materialRef.current) {
            materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, hovered ? 0.6 : 0.3, 0.1);
            materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, hovered ? 4 : 1.5, 0.1);
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <MeshDistortMaterial
                        ref={materialRef}
                        color={hovered ? "#ffffff" : "#eeeeee"}
                        metalness={1}
                        roughness={0.02}
                        distort={0.3}
                        speed={1.5}
                        envMapIntensity={1}
                        transparent={true}
                        opacity={1}
                    />
                </mesh>

                {/* Project Info - Positioned to the right of the orb */}
                <group ref={textGroupRef} position={[0.5, 0, 0]} scale={hovered ? 1.05 : 1}>
                    <Text
                        position={[0, 0.1, 0]}
                        fontSize={0.14}
                        anchorX="left"
                        anchorY="middle"
                        color="white"
                        fillOpacity={isNavigating ? 0 : 1}
                    >
                        {title.toUpperCase()}
                        <meshBasicMaterial transparent opacity={isNavigating ? 0 : 1} />
                    </Text>
                    <Text
                        position={[0, -0.1, 0]}
                        fontSize={0.07}
                        anchorX="left"
                        anchorY="middle"
                        color="rgba(255,255,255,0.6)"
                        maxWidth={3}
                        fillOpacity={isNavigating ? 0 : 0.6}
                    >
                        {desc}
                        <meshBasicMaterial transparent opacity={isNavigating ? 0 : 0.6} />
                    </Text>
                </group>

            </Float>
        </group>
    );
}

export default function GlassGallery() {
    const projects = [
        { title: "Luxurious Towing", desc: "High-End Automotive Service Platform" },
        { title: "Perfect Protocol", desc: "Cybersecurity & Encryption Interface" },
        { title: "Atmospheric Drop", desc: "Interactive 3D Weather Simulation" },
    ];

    return (
        <group position={[0, 0, 0]}>
            {projects.map((p, i) => (
                <ChromeOrb
                    key={i}
                    title={p.title}
                    desc={p.desc}
                    index={i}
                    count={projects.length}
                    position={[0, -i * 1.1, 0]} // Stacked top-down
                />
            ))}
        </group>
    );
}
