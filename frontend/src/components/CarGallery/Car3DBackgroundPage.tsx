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
  OpenInFull,
  CloseFullscreen,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Garage } from './Garage';
import { CarModel } from './CarModel';
import MainMenu from './MainMenu';
import BrandSelectionMenu from './BrandSelectionMenu';
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
//   Key   : warm orange, front-left, high    (hard shadows)
//   Fill  : cool blue,   front-right, low    (soft counter)
//   Rim   : cool blue,   behind-right, tight (specular pop)
// ─────────────────────────────────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      {/* Key: warm, front-left, high */}
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
      {/* Rim: cool, behind-right, tight spot */}
      <spotLight
        position={[5, 7, -5]}
        intensity={2.5}
        color="#80B4FF"
        angle={0.25}
        penumbra={0.3}
        castShadow={false}
      />
      {/* Ambient fill to avoid pure black undersides */}
      <ambientLight intensity={0.12} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CameraController — manages OrbitControls + preset camera repositioning.
// Must live inside <Canvas> to access useThree.
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
    // Only reposition when the preset actually changes
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
      // ── Existing constraints — do not change ──
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

  // ── UI visibility (existing drag-to-hide behaviour) ────────────────────────
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

  // ── Task 2 — "Fake 2D" camera lock + idle cinematic pan ───────────────────
  // On load: controls locked (looks like a still render).
  // First mousemove: unlock.
  // 4 s idle: re-enable the AFK auto-rotate.
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

  // ── Task 4 — Environment / HDRI state with crossfade overlay ──────────────
  const [envPreset, setEnvPreset] = useState<EnvironmentPreset>('studio');
  const [envFading, setEnvFading] = useState(false);

  const transitionEnv = useCallback((next: EnvironmentPreset) => {
    setEnvFading(true);                      // fade to black
    setTimeout(() => {
      setEnvPreset(next);
      setEnvFading(false);                   // fade back in
    }, 350);
  }, []);

  // Sync env when the view mode or selected car changes
  useEffect(() => {
    transitionEnv(isDetailView ? selectedConfig.hdriPreset : 'studio');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetailView, selectedConfig.filename]);

  // ── Task 2d — camera preset: gallery overview OR per-car magazine angle ────
  const cameraPreset = isDetailView ? selectedConfig.cameraPreset : GALLERY_CAMERA;

  // ── Car navigation (cycle through CAR_CONFIGS) ────────────────────────────
  const navigateCar = (dir: 1 | -1) => {
    const idx  = CAR_CONFIGS.indexOf(selectedConfig);
    const next = (idx + dir + CAR_CONFIGS.length) % CAR_CONFIGS.length;
    setSelectedConfig(CAR_CONFIGS[next]);
  };

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
    }}>

      {/* ── Task 4b — HDRI crossfade black overlay ─────────────────────────── */}
      <Box sx={{
        position:       'absolute',
        inset:          0,
        zIndex:         5,
        background:     '#000',
        opacity:        envFading ? 1 : 0,
        transition:     'opacity 0.35s ease',
        pointerEvents:  'none',
      }} />

      {/* ── Three.js Canvas ───────────────────────────────────────────────── */}
      <Canvas
        shadows
        style={{ height: '100%', width: '100%' }}
        camera={{ position: [4.5, 2.4, 5.5], fov: 50 }}
      >
        {/* Task 3a — FM4 3-point lighting rig */}
        <SceneLighting />

        {/* Task 3b — Environment (studio for gallery; car-specific for detail) */}
        {/* Task 4a/4c — controlled by envPreset state */}
        <Environment
          preset={envPreset}
          background
          backgroundBlurriness={0.04}
        />

        {/* Showroom mesh (static) */}
        <Garage />

        {/* Normalised car model */}
        <CarModel config={selectedConfig} />

        {/* Task 3c — Contact shadow directly under the car; no grid floor */}
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.45}
          scale={7}
          blur={2.5}
          far={1.5}
          resolution={512}
        />

        {/* Task 3d — Simple shadow-receiving plane under the car.
            Replaces AccumulativeShadows which conflicted with the showroom floor.
            shadowMaterial is transparent black so it composites cleanly. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial transparent opacity={0.35} />
        </mesh>

        {/* Task 2 — camera with fake-2D lock and idle AFK pan */}
        <CameraController
          preset={cameraPreset}
          enabled={controlsEnabled}
          autoRotate={autoRotate}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      </Canvas>

      {/* ── Existing right-edge nav link ─────────────────────────────────── */}
      <IconButton
        component={Link}
        to="/localeMain"
        sx={{
          position:  'fixed',
          right:     0,
          top:       '50%',
          transform: 'translateY(-50%)',
          zIndex:    1000,
          color:     'white',
          opacity:   0,
          '&:hover': { opacity: 1 },
          transition: 'opacity 0.3s ease',
        }}
      >
        <ChevronRight fontSize="large" />
      </IconButton>

      {/* ── Car carousel prev / next — centred at the bottom ────────────── */}
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
          <IconButton
            onClick={() => navigateCar(-1)}
            sx={carNavBtnSx}
            aria-label="Previous car"
          >
            <ArrowBackIos fontSize="small" sx={{ color: 'white', ml: '4px' }} />
          </IconButton>
          <IconButton
            onClick={() => navigateCar(1)}
            sx={carNavBtnSx}
            aria-label="Next car"
          >
            <ArrowForwardIos fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Fade>

      {/* ── Detail-view toggle — pinned bottom-right, never overlaps ─────── */}
      <Fade in={showUI} timeout={400}>
        <IconButton
          onClick={() =>
            setCurrentView(isDetailView ? 'menu' : 'carSelection')
          }
          sx={{
            position:       'absolute',
            right:          '1.5rem',
            bottom:         '2rem',
            zIndex:         10,
            background:     'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            border:         '0.5px solid rgba(255,255,255,0.15)',
            color:          'white',
            '&:hover': { background: 'rgba(255,255,255,0.18)' },
            transition:     'all 0.2s ease',
          }}
          title={isDetailView ? 'Back to showroom' : 'Enter car detail view'}
        >
          {isDetailView
            ? <CloseFullscreen fontSize="small" />
            : <OpenInFull fontSize="small" />
          }
        </IconButton>
      </Fade>

      {/* ── Car nameplate — sits above the button row ────────────────────── */}
      <Box sx={{
        position:      'absolute',
        bottom:        '5.5rem',
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:        1000,
        textAlign:     'center',
        pointerEvents: 'none',
        opacity:       showUI ? 1 : 0,
        transition:    'opacity 0.5s ease',
        userSelect:    'none',
      }}>
        <Typography
          variant="h5"
          sx={{
            color:         'rgba(255,255,255,0.92)',
            fontWeight:    300,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textShadow:    '0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          {selectedConfig.year}&nbsp;&nbsp;{selectedConfig.displayName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color:         'rgba(255,255,255,0.45)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            display:       'block',
            mt:            '2px',
          }}
        >
          {selectedConfig.country}
          {isDetailView
            ? ` — ${selectedConfig.hdriPreset.toUpperCase()}`
            : ' — STUDIO'}
        </Typography>
      </Box>

      {/* ── Existing menu overlays ───────────────────────────────────────── */}
      <Fade in={showUI} timeout={500}>
        <Box>
          {currentView === 'menu' && (
            <MainMenu onViewChange={setCurrentView} />
          )}
          {currentView === 'brandSelection' && (
            <BrandSelectionMenu onViewChange={setCurrentView} />
          )}
        </Box>
      </Fade>
    </Box>
  );
};

// ─── Shared style for the prev/next carousel buttons ─────────────────────────
const carNavBtnSx = {
  background:     'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(8px)',
  border:         '0.5px solid rgba(255,255,255,0.15)',
  '&:hover': { background: 'rgba(255,255,255,0.18)' },
  transition:     'all 0.2s ease',
} as const;

export default FullscreenViewer;
