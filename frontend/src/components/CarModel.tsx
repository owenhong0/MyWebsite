import { useGLTF } from "@react-three/drei";

type CarProps = {
  modelPath: string;
};

export function CarModel({ modelPath }: CarProps) {
  const { scene } = useGLTF(modelPath)

  return (
      <primitive
          object={scene}
          scale={1}
          position={[-26,0.1, -10]}
          rotation={[0, 45, 0]}
      />
  );
}