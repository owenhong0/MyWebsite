import { useGLTF } from "@react-three/drei";

export function Garage() {
  const { scene } = useGLTF("/models/showroom.glb")

  return (
      <primitive
          object={scene}
          scale={1}
          position={[0,0,0]}
      />
  );
}