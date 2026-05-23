import { useGLTF } from '@react-three/drei';
import { CAR_CONFIGS, type CarConfig } from './cars.config';

type CarProps = {
  config: CarConfig;
};

/**
 * Loads a GLB and applies the per-car normalizeScale so every model fits the
 * same ~4-unit bounding box regardless of how it was exported from Sketchfab.
 *
 * Y-rotation of -π/6 (-30°) gives a slight front-3/4 offset that pairs with
 * the magazine-angle cameraPresets defined in cars.config.ts.
 */
export function CarModel({ config }: CarProps) {
  const { scene } = useGLTF(config.filename);

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
