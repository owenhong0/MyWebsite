/**
 * CarThumbnail — self-contained mini Three.js canvas for gallery cards.
 *
 * Renders each car in the same FM4-style studio rig as the main viewer:
 *   • 3-point warm/cool lighting
 *   • Studio HDRI background (consistent across all cars)
 *   • Dark MeshReflectorMaterial floor
 *   • Fixed "showroom" camera angle (same for every car → visual consistency)
 *   • No OrbitControls (static render)
 *
 * Models are preloaded at module level in CarModel.tsx, so the canvas
 * paints on the first frame with no hitching.
 */

import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
} from '@react-three/drei';
import { Box } from '@mui/material';
import { CarModel } from './CarModel';
import { type CarConfig } from './cars.config';

// ─── Fixed FM4 showroom camera ────────────────────────────────────────────────
// Slightly elevated front-3/4 — same for all cars so cards look uniform.
const CAM_POS:    [number, number, number] = [4.5, 1.15, 7.0];
const CAM_TARGET: [number, number, number] = [0,   0.65, 0  ];

function ThumbCameraInit() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...CAM_POS);
    camera.lookAt(...CAM_TARGET);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ─── The actual scene (runs inside Canvas) ────────────────────────────────────
function ThumbScene({ config }: { config: CarConfig }) {
  return (
    <>
      <ThumbCameraInit />

      {/* FM4 3-point rig — reduced shadow-map size for thumbnail perf */}
      <directionalLight
        position={[-4, 8, 5]}
        intensity={1.8}
        color="#FFE0A0"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[5, 2, 5]} intensity={0.6} color="#A0C0FF" />
      <spotLight position={[5, 7, -5]} intensity={2.5} color="#80B4FF" angle={0.25} penumbra={0.3} />
      <ambientLight intensity={0.12} />

      {/* Studio HDRI — same for every thumbnail for consistency */}
      <Environment
        preset="studio"
        background
        backgroundBlurriness={0.04}
        backgroundIntensity={0.75}
      />

      {/* Dark reflective floor — lower resolution for thumbnails */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[200, 80]}
          resolution={256}
          mixStrength={0.4}
          mixBlur={6}
          mirror={0.3}
          color="#111111"
          metalness={0.6}
          roughness={1}
        />
      </mesh>

      {/* Thin shadow receiver just above the reflector */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.35} />
      </mesh>

      <CarModel config={config} />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.55}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />
    </>
  );
}

// ─── Shimmer placeholder shown while the canvas / model loads ─────────────────
function ThumbnailShimmer() {
  return (
    <Box
      sx={{
        width:      '100%',
        height:     '100%',
        background: 'linear-gradient(135deg, #111 0%, #1a1a1a 50%, #111 100%)',
        backgroundSize: '200% 200%',
        animation:  'shimmer 1.6s ease-in-out infinite',
        '@keyframes shimmer': {
          '0%':   { backgroundPosition: '0% 50%'   },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%'   },
        },
      }}
    />
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export function CarThumbnail({ config }: { config: CarConfig }) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Suspense fallback={<ThumbnailShimmer />}>
        <Canvas
          shadows
          camera={{ fov: 46 }}
          gl={{ antialias: true, alpha: false }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ThumbScene config={config} />
        </Canvas>
      </Suspense>
    </Box>
  );
}
