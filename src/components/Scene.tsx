"use client";

import { Environment, ContactShadows, OrbitControls, Stars, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import Portal from "./Portal";
import CameraArrival from "./CameraArrival";
import DataParticles from "./DataParticles";

export default function Scene() {
    return (
        <>
            <CameraArrival />
            {/* Pure Abstract Procedural Environment (No photographic "inside") */}
            <Environment resolution={512}>
                <group rotation={[-Math.PI / 4, 0, 0]}>
                    <Lightformer form="circle" intensity={10} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                    <Lightformer form="ring" intensity={2} rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 10, 1]} />
                    <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[10, 2, 1]} scale={[10, 10, 1]} />
                    {/* Add a very soft fill light former to prevent total blackness */}
                    <Lightformer form="rect" intensity={1} position={[0, 0, 10]} scale={[20, 20, 1]} color="#ffffff" />
                </group>
            </Environment>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />

            {/* Subtle Stars */}
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

            {/* The Artifact */}
            {/* Navigation Orbs */}
            <group position={[0, -0.2, 0]}>
                <Portal
                    destination="/works"
                    label="PORTFOLIO"
                    position={[-3.5, 0, 0]}
                    scale={1.1}
                    fontSize="0.8rem"
                    isSideLayout={true}
                />
                <Portal
                    destination="/about"
                    label="ABOUT US"
                    position={[0, 0.5, 0]}
                    scale={1.3}
                    showCore={true}
                />
                <Portal
                    destination="/contact"
                    label="CONTACT"
                    position={[3.5, 0, 0]}
                    scale={1.1}
                    fontSize="0.8rem"
                    isSideLayout={true}
                />
            </group>

            {/* Ground Shadow for "Heavy Object" feel */}
            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />

            {/* Atmospheric Environment */}
            <DataParticles count={200} />

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 2.5}
            />

            {/* POST PROCESSING STACK */}
            <EffectComposer>
                {/* Bloom: Makes the chrome highlights glow */}
                <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    intensity={0.5}
                    radius={0.7}
                />
            </EffectComposer>
        </>
    );
}
