import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { CAR_CONFIGS, type CarConfig } from './cars.config';

type CarProps = {
  config: CarConfig;
  /** Override the default -30° (front-3/4) Y-rotation. Pass e.g. Math.PI/2 for a side profile. */
  yRotation?: number;
};

/**
 * Loads a GLB, applies per-car normalizeScale, then auto-grounds the model
 * so the lowest vertex sits exactly at y=0 regardless of how the exporter
 * positioned the mesh origin.
 *
 * Default Y-rotation -π/6 (-30°) gives a slight front-3/4 offset.
 * Pass `yRotation` to override (e.g. for side-profile thumbnails).
 */
export function CarModel({ config, yRotation = -Math.PI / 6 }: CarProps) {
  const { scene } = useGLTF(config.filename);

  useEffect(() => {
    if (!scene) return;
    const box = new Box3().setFromObject(scene);
    const groundOffset = box.min.y;
    scene.position.y = -groundOffset;
  }, [scene, config.filename]);

  return (
    <primitive
      object={scene}
      scale={config.normalizeScale}
      position={[0, 0, 0]}
      rotation={[0, yRotation, 0]}
    />
  );
}

// Preload every model so there is no hitching when the user switches cars
CAR_CONFIGS.forEach((c) => useGLTF.preload(c.filename));
