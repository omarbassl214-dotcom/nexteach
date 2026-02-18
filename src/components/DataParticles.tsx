"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export default function DataParticles({ count = 150 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const [isNavigating, setIsNavigating] = useState(false);
    const { mouse } = useThree();

    // Initialize particle data
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Listen for navigation state to fade out
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const navigating = document.body.classList.contains('navigating');
                    setIsNavigating(navigating);
                }
            });
        });

        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);

    useFrame((_state, delta) => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            // Update rotation/position logic
            particle.t += particle.speed / 2;
            const t = particle.t;
            const s = Math.cos(t);

            // Limited mouse reaction to prevent overflow/wild jitter
            const mx = mouse.x * 0.5;
            const my = mouse.y * 0.5;

            dummy.position.set(
                (particle.xFactor + mx) + (Math.cos(t) * particle.factor),
                (particle.yFactor + my) + (Math.sin(t) * particle.factor),
                (particle.zFactor) + (Math.cos(t) * particle.factor)
            );

            // Move towards center slightly for a "contained" feel
            dummy.position.multiplyScalar(0.98);

            dummy.rotation.set(s * 5, s * 5, s * 5);

            const scale = 0.05 + Math.random() * 0.1;
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;

        // Animation for fade out
        if (isNavigating) {
            meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color="white"
                metalness={1}
                roughness={0.1}
                transparent
                opacity={0.4}
                emissive="white"
                emissiveIntensity={0.5}
            />
        </instancedMesh>
    );
}
