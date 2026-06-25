import { useGLTF } from "@react-three/drei";
import { DoubleSide, Light, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { useEffect } from "react";
import { asset } from "./cars.config";

export function Garage() {
    const { scene } = useGLTF(asset("/models/showroom.glb"));

    // Keep emissive panel glow and fix materials that block the HDRI background
    useEffect(() => {
        scene.traverse((child) => {
            const mesh = child as Mesh;
            if (!mesh.isMesh) return;

            const mat = mesh.material as MeshStandardMaterial;
            if (!mat) return;

            // Preserve emissive glow on light-panel meshes
            if (mat.emissive) {
                mat.emissiveIntensity = 2;
                mat.toneMapped = false;
            }

            // Step 5 fix: any mesh that is clearly a background card / skybox quad
            // (large, thin, near the scene boundary) must not write to the depth buffer
            // so the HDRI environment shows through behind it.
            const box = mesh.geometry.boundingBox;
            if (!box) mesh.geometry.computeBoundingBox();
            const size = mesh.geometry.boundingBox!.getSize(new Vector3());
            const isBackgroundPlane =
                (size as any).x > 30 || (size as any).z > 30;   // large flat geometry

            if (isBackgroundPlane) {
                mat.depthWrite   = false;
                mat.transparent  = true;
                mat.alphaTest    = 0.05;
                mat.side         = DoubleSide;
                mesh.renderOrder = -1;
            }

            mat.needsUpdate = true;
        });
    }, [scene]);

    // Reduce embedded lights so they don't fight the new 3-point rig
    useEffect(() => {
        scene.traverse((object) => {
            const light = object as Light;
            if (light.isLight) {
                light.intensity = 300;   // was 1000 — softer now that we have the FM4 rig
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