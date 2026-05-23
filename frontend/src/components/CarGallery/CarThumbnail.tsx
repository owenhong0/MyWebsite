/**
 * CarThumbnail — Porsche-website-inspired side-profile card render.
 *
 * Visual language:
 *   • Transparent WebGL canvas → car "floats" on the card's light background
 *   • Side-profile camera (car rotated ~80° so the flank faces forward)
 *   • Soft even product-photography lighting — no dramatic shadows
 *   • Studio IBL for realistic reflections without a visible HDRI background
 *   • Light grey ContactShadows (not black) for an automotive catalogue feel
 *   • No floor mesh — the light background is the floor reference
 */

import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { Box } from '@mui/material';
import { CarModel } from './CarModel';
import { type CarConfig } from './cars.config';

// ─── Camera ───────────────────────────────────────────────────────────────────
// Positioned directly in front of the car (which is rotated ~80° so its side
// now faces this camera).  Slightly elevated and offset to give a gentle
// above-and-front-3/4 angle — matching the classic Porsche model-selector look.
const CAM_POS:    [number, number, number] = [0, 1.1, 6.0];
const CAM_TARGET: [number, number, number] = [0, 0.55, 0];
// Y-rotation applied to the car: roughly 80° so the right flank faces the camera,
// but with just enough nose visible to read as a real car and not a flat blueprint.
const CAR_Y_ROT = Math.PI * 0.44;  // ≈ 79°

function ThumbCameraInit() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...CAM_POS);
    camera.lookAt(...CAM_TARGET);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function ThumbScene({ config }: { config: CarConfig }) {
  return (
    <>
      <ThumbCameraInit />

      {/* Studio product-photography lighting: bright + even, no harsh shadows */}
      <ambientLight intensity={1.05} color="#ffffff" />
      {/* Primary: top-front, warm white */}
      <directionalLight position={[-2, 8, 5]} intensity={1.4} color="#fffaf4" />
      {/* Fill: front-right, cool white */}
      <directionalLight position={[4, 3, 4]}  intensity={0.7} color="#f0f4ff" />
      {/* Rim: behind-left, keeps the far flank from going flat */}
      <directionalLight position={[-4, 2, -4]} intensity={0.35} color="#ffffff" />

      {/* Studio IBL — reflections only, no visible HDRI background
          (canvas is transparent so the card's CSS bg shows through) */}
      <Environment preset="studio" />

      {/* Car: rotated so right flank faces the front camera */}
      <CarModel config={config} yRotation={CAR_Y_ROT} />

      {/* Subtle grey shadow under the car — catalogue style, not dramatic */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.18}
        scale={12}
        blur={3.5}
        far={5}
        color="#606060"
      />
    </>
  );
}

// ─── Shimmer placeholder ──────────────────────────────────────────────────────
function ThumbnailShimmer() {
  return (
    <Box
      sx={{
        width:           '100%',
        height:          '100%',
        background:      'linear-gradient(110deg, #ececec 30%, #f8f8f8 50%, #ececec 70%)',
        backgroundSize:  '200% 100%',
        animation:       'shimmer 1.5s linear infinite',
        '@keyframes shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      }}
    />
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export function CarThumbnail({ config }: { config: CarConfig }) {
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<ThumbnailShimmer />}>
        <Canvas
          shadows={false}                          // no expensive shadow maps in thumbnail
          camera={{ fov: 44 }}
          gl={{ antialias: true, alpha: true }}    // transparent → card bg shows through
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ThumbScene config={config} />
        </Canvas>
      </Suspense>
    </Box>
  );
}
