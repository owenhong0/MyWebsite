import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { CAR_CONFIGS, type CarConfig } from './cars.config';

type CarProps = {
  config: CarConfig;
};

/**
 * Loads a GLB, applies per-car normalizeScale, then auto-grounds the model
 * so the lowest vertex sits exactly at y=0 regardless of how the exporter
 * positioned the mesh origin.
 *
 * Y-rotation -π/6 (-30°) gives a slight front-3/4 offset that pairs with
 * the magazine-angle cameraPresets defined in cars.config.ts.
 */
export function CarModel({ config }: CarProps) {
  const { scene } = useGLTF(config.filename);

  // Step 4 — push the model up so its lowest point is flush with y=0
  useEffect(() => {
    if (!scene) return;
    const box = new Box3().setFromObject(scene);
    const groundOffset = box.min.y;      // negative if origin is above floor
    scene.position.y = -groundOffset;
  }, [scene, config.filename]);

  return (
    <primitive
      object={scene}
      scale={config.normalizeScale}
      position={[0, 0, 0]}
      rotation={[0, -Math.PI / 6, 0]}
    />
  );
}

// Preload every model so there is no hitching when the user switches cars
CAR_CONFIGS.forEach((c) => useGLTF.preload(c.filename));
