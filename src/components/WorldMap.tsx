"use client";

import Portal from "./Portal";
import GlassGallery from "./GlassGallery";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { SCENE_POSITIONS } from "@/constants/scene";

export default function WorldMap({ onNavigate, isReforming }: { onNavigate: (url: string) => void, isReforming: boolean }) {
    return (
        <group>
            {/* Hub Scene [0, 0, 0] */}
            <group position={SCENE_POSITIONS["/"]}>
                <Portal
                    destination="/about"
                    label="ENTER"
                    position={[0, 0, 0]}
                />
                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </group>

            {/* About Scene [100, 0, 0] */}
            <group position={SCENE_POSITIONS["/about"]}>
                <Portal
                    destination="/works"
                    label="SELECTED WORKS"
                    position={[4.0, 0, 0]}
                    scale={1.5}
                    fontSize="1.25rem"
                    isSideLayout={true}
                />
                <ContactShadows position={[4.0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </group>

            {/* Works Scene [200, 0, 0] */}
            <group position={SCENE_POSITIONS["/works"]}>
                <GlassGallery />
                <Portal
                    destination="/contact"
                    label="CONTACT ME"
                    position={[7.0, 3.5, 0]}
                    scale={1.2}
                    fontSize="1rem"
                    isSideLayout={true}
                />
                <ContactShadows position={[7.0, 1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </group>

            {/* Contact Scene [300, 0, 0] */}
            <group position={SCENE_POSITIONS["/contact"]}>
                <Portal
                    destination="/"
                    label="RETURN HOME"
                    position={[2.0, 0, 0]}
                    scale={1.5}
                    fontSize="1.25rem"
                    isSideLayout={true}
                />
                <ContactShadows position={[2.0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </group>
        </group>
    );
}
