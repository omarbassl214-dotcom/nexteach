"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Stars, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Portal from "./Portal";
import CameraArrival from "./CameraArrival";

export default function AboutScene() {
    return (
        <div className="absolute top-0 right-0 w-full h-full z-0"> {/* z-0 allows it to be clicked if content is pointer-events-none */}
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: false }} dpr={[1, 2]}> {/* Camera Z=8 to match Hub */}
                <CameraArrival />

                <Environment resolution={512}>
                    <group rotation={[-Math.PI / 4, 0, 0]}>
                        <Lightformer form="circle" intensity={10} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                        <Lightformer form="ring" intensity={2} rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 10, 1]} />
                        <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[10, 2, 1]} scale={[10, 10, 1]} />
                        <Lightformer form="rect" intensity={1} position={[0, 0, 10]} scale={[20, 20, 1]} color="#ffffff" />
                    </group>
                </Environment>

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />

                {/* Subtle Stars */}
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                {/* Positioned nicely in the center but not blocking text too much */}
                <Portal
                    destination="/works"
                    label="MY WORK" // Shorter Label
                    position={[3.5, 0, 0]} // Standardized side position
                    scale={1.1} // Standardized side scale
                    fontSize="1.25rem" // Much smaller text
                    isSideLayout={true} // Complex transition for side layout
                />
                {/* Ground Shadow */}
                <ContactShadows position={[2.0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />

                {/* NECESSARY POST PROCESSING FOR VISIBILITY */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={0.5}
                        radius={0.7}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
