import React from 'react';
import { useGLTF } from '@react-three/drei';

interface CarModelProps {
  modelPath: string; // Explicitly define modelPath as a string
}

const CarModel: React.FC<CarModelProps> = ({ modelPath }) => {
  // useGLTF returns a GLTF object; you may want to assert the type to avoid ambiguity.
  const { scene } = useGLTF(modelPath) as any; // Type assertion to avoid errors

  return <primitive object={scene} />;
};

export default CarModel;
