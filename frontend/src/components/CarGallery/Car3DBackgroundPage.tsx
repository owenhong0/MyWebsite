import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
} from '@react-three/drei';
import {
  Box,
  Fade,
  IconButton,
  Typography,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  ChevronRight,
  CloseFullscreen,
  OpenInFull,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { CarModel } from './CarModel';
import DropdownNav from '../common/DropdownNav';
import { MakeStrip } from '../../pages/MakeSelectionPage';
import {
  CAR_CONFIGS,
  GALLERY_CAMERA,
  type CarConfig,
  type CameraPreset,
  type EnvironmentPreset,
} from './cars.config';

// ─── ViewState ────────────────────────────────────────────────────────────────
export type ViewState =
  | 'menu'
  | 'brandSelection'
  | 'modelSelection'
  | 'variantSelection'
  | 'carSelection';

// ─────────────────────────────────────────────────────────────────────────────
// SceneLighting — FM4-style 3-point autoshow rig
// ─────────────────────────────────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      {/* Key: warm, front-left, high — primary shadow caster */}
      <directionalLight
        position={[-4, 8, 5]}
        intensity={1.8}
        color="#FFE0A0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Fill: cool, front-right, low */}
      <directionalLight
        position={[5, 2, 5]}
        intensity={0.6}
        color="#A0C0FF"
      />
      {/* Rim: cool spot, behind-right, tight */}
      <spotLight
        position={[5, 7, -5]}
        intensity={2.5}
        color="#80B4FF"
        angle={0.25}
        penumbra={0.3}
        castShadow={false}
      />
      <ambientLight intensity={0.12} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReflectorGround — Step 3: dark reflective plane for automotive press look
// ─────────────────────────────────────────────────────────────────────────────
function ReflectorGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixStrength={0.4}
        mixBlur={8}
        mirror={0.3}
        color="#111111"
        metalness={0.6}
        roughness={1}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ShadowPlane — sits just above the reflector to cast ContactShadow correctly
// ─────────────────────────────────────────────────────────────────────────────
function ShadowPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial transparent opacity={0.35} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CameraController — preset repositioning + OrbitControls
// ─────────────────────────────────────────────────────────────────────────────
interface CameraControllerProps {
  preset: CameraPreset;
  enabled: boolean;
  autoRotate: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function CameraController({
  preset,
  enabled,
  autoRotate,
  onDragStart,
  onDragEnd,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const prevKey = useRef('');

  useEffect(() => {
    const key = preset.position.join(',') + '|' + preset.target.join(',');
    if (key === prevKey.current) return;
    prevKey.current = key;

    camera.position.set(preset.position[0], preset.position[1], preset.position[2]);
    if (controlsRef.current) {
      controlsRef.current.target.set(
        preset.target[0],
        preset.target[1],
        preset.target[2],
      );
      controlsRef.current.update();
    }
  }, [preset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      onStart={onDragStart}
      onEnd={onDragEnd}
      minAzimuthAngle={-Math.PI * (100 / 180)}
      maxAzimuthAngle={Math.PI * (100 / 180)}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
      minDistance={3}
      maxDistance={25}
      target={preset.target}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FullscreenViewer — main export
// ─────────────────────────────────────────────────────────────────────────────
const FullscreenViewer = () => {
  // ── Car state ──────────────────────────────────────────────────────────────
  const [selectedConfig, setSelectedConfig] = useState<CarConfig>(CAR_CONFIGS[0]);
  const [currentView, setCurrentView]       = useState<ViewState>('menu');
  const isDetailView = currentView === 'carSelection';

  // ── UI visibility (drag-to-hide) ───────────────────────────────────────────
  const [isDragging, setIsDragging] = useState(false);
  const [showUI, setShowUI]         = useState(true);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isDragging) {
      setShowUI(false);
    } else {
      id = setTimeout(() => setShowUI(true), 3000);
    }
    return () => clearTimeout(id);
  }, [isDragging]);

  // ── Fake-2D camera lock + idle cinematic pan ───────────────────────────────
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const [autoRotate, setAutoRotate]            = useState(false);
  const hasInteracted = useRef(false);
  const idleTimer     = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMove = () => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        setControlsEnabled(true);
      }
      setAutoRotate(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setAutoRotate(true), 4000);
    };
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // ── HDRI crossfade ─────────────────────────────────────────────────────────
  const [envPreset, setEnvPreset] = useState<EnvironmentPreset>('studio');
  const [envFading, setEnvFading] = useState(false);

  const transitionEnv = useCallback((next: EnvironmentPreset) => {
    setEnvFading(true);
    setTimeout(() => {
      setEnvPreset(next);
      setEnvFading(false);
    }, 350);
  }, []);

  useEffect(() => {
    // In open-environment mode the car's HDRI is always active,
    // whether in gallery or detail view. Studio is the fallback.
    transitionEnv(isDetailView ? selectedConfig.hdriPreset : 'studio');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetailView, selectedConfig.filename]);

  // ── Camera ────────────────────────────────────────────────────────────────
  const cameraPreset = isDetailView ? selectedConfig.cameraPreset : GALLERY_CAMERA;

  const navigate = useNavigate();

  // ── Car navigation ────────────────────────────────────────────────────────
  const navigateCar = (dir: 1 | -1) => {
    const idx  = CAR_CONFIGS.indexOf(selectedConfig);
    const next = (idx + dir + CAR_CONFIGS.length) % CAR_CONFIGS.length;
    setSelectedConfig(CAR_CONFIGS[next]);
  };

  return (
    <Box sx={{
      height:   '100vh',
      width:    '100vw',
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
    }}>

      {/* Top nav */}
      <DropdownNav activeOverride="Gallery" />

      {/* HDRI crossfade overlay */}
      <Box sx={{
        position:      'absolute',
        inset:         0,
        zIndex:        5,
        background:    '#000',
        opacity:       envFading ? 1 : 0,
        transition:    'opacity 0.35s ease',
        pointerEvents: 'none',
      }} />

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <Canvas
        shadows
        style={{ height: '100%', width: '100%' }}
        camera={{ position: [4, 1.2, 7], fov: 50 }}
      >
        {/* FM4 3-point rig */}
        <SceneLighting />

        {/* Step 2 — HDRI as actual visible background */}
        <Environment
          preset={envPreset}
          background
          backgroundBlurriness={0.04}
          backgroundIntensity={0.8}
        />

        {/* Step 3 — dark reflective ground plane */}
        <ReflectorGround />

        {/* Shadow-receiving plane just above the reflector */}
        <ShadowPlane />

        {/* Car model (auto-grounded in CarModel.tsx) */}
        <CarModel config={selectedConfig} />

        {/* Step 5 — single ContactShadows, everything else removed */}
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.5}
          scale={10}
          blur={2.5}
          far={4}
          color="#000000"
        />

        <CameraController
          preset={cameraPreset}
          enabled={controlsEnabled}
          autoRotate={autoRotate}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      </Canvas>

      {/* Existing right-edge nav */}
      <IconButton
        component={Link}
        to="/localeMain"
        sx={{
          position:   'fixed',
          right:      0,
          top:        '50%',
          transform:  'translateY(-50%)',
          zIndex:     1000,
          color:      'white',
          opacity:    0,
          '&:hover':  { opacity: 1 },
          transition: 'opacity 0.3s ease',
        }}
      >
        <ChevronRight fontSize="large" />
      </IconButton>

      {/* Make emblem strip — clicking navigates into that make's cars */}
      <MakeStrip />

      {/* ← → car cycle — centred at bottom */}
      <Fade in={showUI} timeout={400}>
        <Box sx={{
          position:  'absolute',
          bottom:    '2rem',
          left:      '50%',
          transform: 'translateX(-50%)',
          display:   'flex',
          gap:       '1rem',
          zIndex:    10,
        }}>
          <IconButton onClick={() => navigateCar(-1)} sx={navBtnSx} aria-label="Previous car">
            <ArrowBackIos fontSize="small" sx={{ color: 'white', ml: '4px' }} />
          </IconButton>
          <IconButton onClick={() => navigateCar(1)} sx={navBtnSx} aria-label="Next car">
            <ArrowForwardIos fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Fade>

      {/* Detail-view toggle — pinned bottom-right */}
      <Fade in={showUI} timeout={400}>
        <IconButton
          onClick={() => setCurrentView(isDetailView ? 'menu' : 'carSelection')}
          sx={{
            position:       'absolute',
            right:          '1.5rem',
            bottom:         '2rem',
            zIndex:         10,
            background:     'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            border:         '0.5px solid rgba(255,255,255,0.15)',
            color:          'white',
            '&:hover':      { background: 'rgba(255,255,255,0.18)' },
            transition:     'all 0.2s ease',
          }}
          title={isDetailView ? 'Back to studio' : 'Enter detail view'}
        >
          {isDetailView ? <CloseFullscreen fontSize="small" /> : <OpenInFull fontSize="small" />}
        </IconButton>
      </Fade>

      {/* Car nameplate */}
      <Box sx={{
        position:      'absolute',
        bottom:        '5.5rem',
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:        10,
        textAlign:     'center',
        pointerEvents: 'none',
        opacity:       showUI ? 1 : 0,
        transition:    'opacity 0.5s ease',
        userSelect:    'none',
      }}>
        <Typography variant="h5" sx={{
          color:         'rgba(255,255,255,0.92)',
          fontWeight:    300,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          textShadow:    '0 2px 12px rgba(0,0,0,0.6)',
        }}>
          {selectedConfig.year}&nbsp;&nbsp;{selectedConfig.displayName}
        </Typography>
        <Typography variant="caption" sx={{
          color:         'rgba(255,255,255,0.45)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          display:       'block',
          mt:            '2px',
        }}>
          {selectedConfig.country}
          {isDetailView ? ` — ${selectedConfig.hdriPreset.toUpperCase()}` : ' — STUDIO'}
        </Typography>
      </Box>

      {/* Legacy menu overlays — kept for backward compat, hidden now routing handles navigation */}
    </Box>
  );
};

// Shared style for prev/next buttons
const navBtnSx = {
  background:     'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(8px)',
  border:         '0.5px solid rgba(255,255,255,0.15)',
  '&:hover':      { background: 'rgba(255,255,255,0.18)' },
  transition:     'all 0.2s ease',
} as const;

export default FullscreenViewer;
