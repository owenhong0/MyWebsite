import {useGLTF} from "@react-three/drei";
import {Light, Mesh, MeshStandardMaterial} from "three";
import {useEffect} from "react";

export function Garage() {
    const {scene} = useGLTF("/models/showroom.glb")

    // Traverse and modify materials after scene load
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const m = (child as Mesh).material as MeshStandardMaterial;
                if (m.emissive) {
                    m.emissiveIntensity = 2;
                    m.toneMapped = false;
                }

            }
        });
    }, [scene]);

    useEffect(() => {
        scene.traverse((object) => {
            const light = object as Light;
            if (light.isLight) {
                light.intensity = 1000;
            }
        });
    }, [scene]);

    return (
        <primitive
            object={scene}
            scale={1}
            position={[0, 0, 0]}
        />
    );
}