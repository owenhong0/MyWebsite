import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack, KeyboardArrowDown, KeyboardArrowUp, Close } from '@mui/icons-material';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
} from '@react-three/drei';
import { useNavigate, useParams } from 'react-router-dom';
import { getCarBySlug } from '../components/CarGallery/cars.config';
import { CarModel } from '../components/CarGallery/CarModel';
import DropdownNav from '../components/common/DropdownNav';
import { MakeStrip } from './MakeSelectionPage';

// ─── Scene lighting (same FM4 rig) ────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      <directionalLight position={[-4, 8, 5]} intensity={1.8} color="#FFE0A0" castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={30}
        shadow-camera-left={-8} shadow-camera-right={8}
        shadow-camera-top={8} shadow-camera-bottom={-8} />
      <directionalLight position={[5, 2, 5]} intensity={0.6} color="#A0C0FF" />
      <spotLight position={[5, 7, -5]} intensity={2.5} color="#80B4FF" angle={0.25} penumbra={0.3} />
      <ambientLight intensity={0.12} />
    </>
  );
}

// ─── Camera setter ─────────────────────────────────────────────────────────────
function CameraInit({ position }: { position: [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => { camera.position.set(...position); }, []);
  return null;
}

// ─── Spec row ─────────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{
      display:       'flex',
      justifyContent: 'space-between',
      alignItems:    'baseline',
      py:            '10px',
      borderBottom:  '0.5px solid rgba(255,255,255,0.07)',
    }}>
      <Typography sx={{
        fontSize:      '10px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color:         'rgba(255,255,255,0.35)',
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize:   '13px',
        fontWeight: 300,
        color:      'rgba(255,255,255,0.85)',
      }}>
        {value}
      </Typography>
    </Box>
  );
}

// ─── IndividualCarPage ────────────────────────────────────────────────────────
export default function IndividualCarPage() {
  const navigate          = useNavigate();
  const { make = '', slug = '' } = useParams<{ make: string; slug: string }>();
  const car               = getCarBySlug(slug);
  const scrollRef         = useRef<HTMLDivElement>(null);
  const [atDetail, setAtDetail] = useState(false);

  // Track which section is visible for the scroll hint
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setAtDetail(el.scrollTop > el.clientHeight / 2);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToDetail = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.clientHeight, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!car) {
    return (
      <Box sx={{ background: '#0a0a0a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>Car not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={scrollRef}
      sx={{
        height:         '100vh',
        overflowY:      'scroll',
        scrollSnapType: 'y mandatory',
        background:     '#0a0a0a',
        color:          '#fff',
      }}
    >
      <DropdownNav activeOverride="Gallery" />

      {/* ── Section 1: 3D viewer ─────────────────────────────────────────── */}
      <Box sx={{
        height:          '100vh',
        scrollSnapAlign: 'start',
        position:        'relative',
        flexShrink:      0,
      }}>
        {/* Back button */}
        <IconButton
          onClick={() => navigate(`/gallery/${make}`)}
          sx={{ position: 'absolute', top: 60, left: 24, zIndex: 100, color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
        >
          <ArrowBack />
        </IconButton>

        {/* Canvas */}
        <Canvas shadows style={{ height: '100%', width: '100%' }} camera={{ fov: 50 }}>
          <CameraInit position={car.cameraPreset.position} />
          <SceneLighting />
          <Environment preset={car.hdriPreset} background backgroundBlurriness={0.04} backgroundIntensity={0.8} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[40, 40]} />
            <MeshReflectorMaterial blur={[300, 100]} resolution={512} mixStrength={0.4} mixBlur={8} mirror={0.3} color="#111111" metalness={0.6} roughness={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial transparent opacity={0.35} />
          </mesh>
          <CarModel config={car} />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
          <OrbitControls
            target={car.cameraPreset.target}
            minDistance={3} maxDistance={20}
            minPolarAngle={0} maxPolarAngle={Math.PI / 2}
          />
        </Canvas>

        {/* Car nameplate */}
        <Box sx={{
          position:      'absolute',
          bottom:        '5.5rem',
          left:          '50%',
          transform:     'translateX(-50%)',
          textAlign:     'center',
          pointerEvents: 'none',
          zIndex:        10,
        }}>
          <Typography variant="h5" sx={{
            fontWeight:    300,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textShadow:    '0 2px 12px rgba(0,0,0,0.8)',
          }}>
            {car.year}&nbsp;&nbsp;{car.displayName}
          </Typography>
          <Typography variant="caption" sx={{
            color:         'rgba(255,255,255,0.45)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            display:       'block',
            mt:            '2px',
          }}>
            {car.country} — {car.hdriPreset.toUpperCase()}
          </Typography>
        </Box>

        {/* Scroll hint */}
        <Box
          onClick={scrollToDetail}
          sx={{
            position:  'absolute',
            bottom:    '2rem',
            left:      '50%',
            transform: 'translateX(-50%)',
            zIndex:    10,
            display:   'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '4px',
            cursor:        'pointer',
            opacity:       0.4,
            '&:hover':     { opacity: 0.8 },
            transition:    'opacity 0.2s',
            animation:     'bounce 2s ease-in-out infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
              '50%':      { transform: 'translateX(-50%) translateY(5px)' },
            },
          }}
        >
          <Typography sx={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
            Specs
          </Typography>
          <KeyboardArrowDown sx={{ color: '#fff', fontSize: 16 }} />
        </Box>

        {/* Make strip */}
        <MakeStrip activeMake={make} />
      </Box>

      {/* ── Section 2: specs + description ──────────────────────────────── */}
      <Box sx={{
        height:          '100vh',
        scrollSnapAlign: 'start',
        position:        'relative',
        flexShrink:      0,
        display:         'flex',
        overflow:        'hidden',
      }}>
        {/* Left — full-bleed car photo */}
        <Box sx={{
          flex:       '0 0 45%',
          borderRight: '0.5px solid rgba(255,255,255,0.07)',
          overflow:   'hidden',
          position:   'relative',
        }}>
          <Box
            component="img"
            src={car.imageUrl}
            alt={car.displayName}
            sx={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              objectPosition: 'center',
              display:    'block',
            }}
          />
          {/* subtle vignette */}
          <Box sx={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 40%)',
            pointerEvents: 'none',
          }} />
        </Box>

        {/* Right — specs sidebar */}
        <Box sx={{
          flex:          '1',
          display:       'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p:             '3rem',
        }}>
          <Box>
            <Typography sx={{
              fontSize:      '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.3)',
              mb:            '0.4rem',
            }}>
              {car.year} / {car.make}
            </Typography>
            <Typography variant="h5" sx={{
              fontWeight:    200,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mb:            '1.5rem',
            }}>
              {car.displayName}
            </Typography>

            {/* Specs */}
            <SpecRow label="Engine"    value={car.specs.engine}      />
            <SpecRow label="Power"     value={car.specs.power}       />
            <SpecRow label="Torque"    value={car.specs.torque}      />
            <SpecRow label="Weight"    value={car.specs.weight}      />
            <SpecRow label="Top Speed" value={car.specs.topSpeed}    />
            <SpecRow label="0 – 60"    value={car.specs.zeroToSixty} />

            {/* Description */}
            <Typography sx={{
              fontSize:   '13px',
              lineHeight: 1.8,
              color:      'rgba(255,255,255,0.45)',
              mt:         '1.5rem',
            }}>
              {car.description}
            </Typography>
          </Box>

          {/* Close button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton
              onClick={scrollToTop}
              sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#fff' } }}
            >
              <KeyboardArrowUp />
            </IconButton>
            <IconButton
              onClick={() => navigate(`/gallery/${make}`)}
              sx={{
                color:        'rgba(255,255,255,0.5)',
                border:       '0.5px solid rgba(255,255,255,0.15)',
                borderRadius: '2px',
                gap:          '6px',
                px:           '1rem',
                '&:hover':    { color: '#fff', borderColor: 'rgba(255,255,255,0.4)' },
              }}
            >
              <Close fontSize="small" />
              <Typography sx={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Close
              </Typography>
            </IconButton>
          </Box>
        </Box>

        {/* Make strip */}
        <MakeStrip activeMake={make} />
      </Box>
    </Box>
  );
}
