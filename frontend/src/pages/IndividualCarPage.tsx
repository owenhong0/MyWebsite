/**
 * IndividualCarPage — 3-section magazine-style car feature
 *
 * Section 1  (100vh): Interactive 3D viewer — FM4 lighting, OrbitControls
 * Section 2  (100vh): Full-bleed hero photo — Octane/editorial spread
 * Section 3  (100vh): Spec spread — 3 hero stats + secondary grid + story
 */

import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Close,
} from '@mui/icons-material';
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
import { MakeStrip, STRIP_H } from './MakeSelectionPage';

// ─── Scene lighting (FM4 3-point rig) ────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      <directionalLight
        position={[-4, 8, 5]} intensity={1.8} color="#FFE0A0" castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={30}
        shadow-camera-left={-8} shadow-camera-right={8}
        shadow-camera-top={8} shadow-camera-bottom={-8}
      />
      <directionalLight position={[5, 2, 5]} intensity={0.6} color="#A0C0FF" />
      <spotLight position={[5, 7, -5]} intensity={2.5} color="#80B4FF" angle={0.25} penumbra={0.3} />
      <ambientLight intensity={0.12} />
    </>
  );
}

function CameraInit({ position }: { position: [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => { camera.position.set(...position); }, []);
  return null;
}

// ─── Scroll hint arrow ────────────────────────────────────────────────────────
function ScrollHint({
  label,
  onClick,
  bottom,
}: {
  label: string;
  onClick: () => void;
  bottom: string;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position:      'absolute',
        bottom,
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:        10,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '4px',
        cursor:        'pointer',
        opacity:       0.45,
        '&:hover':     { opacity: 0.9 },
        transition:    'opacity 0.2s',
        animation:     'bounce 2s ease-in-out infinite',
        '@keyframes bounce': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)'  },
          '50%':      { transform: 'translateX(-50%) translateY(5px)' },
        },
      }}
    >
      <Typography sx={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
        {label}
      </Typography>
      <KeyboardArrowDown sx={{ color: '#fff', fontSize: 16 }} />
    </Box>
  );
}

// ─── Thin horizontal rule ─────────────────────────────────────────────────────
function Rule({ my = '1.75rem' }: { my?: string }) {
  return (
    <Box sx={{
      width:        '100%',
      height:       '0.5px',
      background:   'rgba(255,255,255,0.1)',
      my,
      flexShrink:   0,
    }} />
  );
}

// ─── Hero stat (big number) ───────────────────────────────────────────────────
function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{
      flex:       1,
      display:    'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px:         '1rem',
      borderRight: '0.5px solid rgba(255,255,255,0.07)',
      '&:last-child': { borderRight: 'none' },
    }}>
      <Typography sx={{
        fontSize:      'clamp(28px, 3.2vw, 52px)',
        fontWeight:    100,
        letterSpacing: '0.02em',
        color:         'rgba(255,255,255,0.93)',
        lineHeight:    1,
      }}>
        {value}
      </Typography>
      <Typography sx={{
        fontSize:      '9px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color:         'rgba(255,255,255,0.28)',
        mt:            '10px',
      }}>
        {label}
      </Typography>
    </Box>
  );
}

// ─── Secondary spec pill ──────────────────────────────────────────────────────
function SecondarySpec({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ flex: 1, px: '0.5rem', textAlign: 'center' }}>
      <Typography sx={{
        fontSize:      '9px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color:         'rgba(255,255,255,0.25)',
        mb:            '5px',
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize:   '12px',
        fontWeight: 300,
        color:      'rgba(255,255,255,0.7)',
        letterSpacing: '0.04em',
      }}>
        {value}
      </Typography>
    </Box>
  );
}

// ─── IndividualCarPage ────────────────────────────────────────────────────────
export default function IndividualCarPage() {
  const navigate = useNavigate();
  const { make = '', slug = '' } = useParams<{ make: string; slug: string }>();
  const car = getCarBySlug(slug);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track which of the 3 sections is currently visible (0 / 1 / 2)
  const [section, setSection] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setSection(Math.min(2, Math.max(0, idx)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (idx: number) =>
    scrollRef.current?.scrollTo({
      top: scrollRef.current.clientHeight * idx,
      behavior: 'smooth',
    });

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
        // hide scrollbar
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <DropdownNav activeOverride="Gallery" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — Interactive 3D viewer
          ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{
        height:          '100vh',
        scrollSnapAlign: 'start',
        position:        'relative',
        flexShrink:      0,
      }}>
        {/* Back to make grid */}
        <IconButton
          onClick={() => navigate(`/gallery/${make}`)}
          sx={{
            position: 'absolute', top: 60, left: 24, zIndex: 100,
            color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' },
          }}
        >
          <ArrowBack />
        </IconButton>

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
          bottom:        `calc(${STRIP_H}px + 5rem)`,
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

        {/* Scroll hint → section 2 */}
        <ScrollHint
          label="Feature"
          onClick={() => scrollTo(1)}
          bottom={`calc(${STRIP_H}px + 1.5rem)`}
        />

        <MakeStrip activeMake={make} />
      </Box>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — Full-bleed editorial hero photo
          ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{
        height:          '100vh',
        scrollSnapAlign: 'start',
        position:        'relative',
        flexShrink:      0,
        overflow:        'hidden',
        background:      '#000',
      }}>
        {/* Hero photo — full width, object-fit cover, positioned to show car body */}
        <Box
          component="img"
          src={car.imageUrl}
          alt={car.displayName}
          sx={{
            position:       'absolute',
            inset:          0,
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: 'center 35%',
            display:        'block',
            // slight editorial desaturation
            filter:         'saturate(0.88) contrast(1.06)',
          }}
        />

        {/* Gradient — heavy at bottom for text, light at top */}
        <Box sx={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.1) 65%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Top-left byline */}
        <Box sx={{ position: 'absolute', top: '1.75rem', left: '2.5rem', zIndex: 2 }}>
          <Typography sx={{
            fontSize:      '10px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.45)',
          }}>
            {car.year} · {car.make} · {car.country}
          </Typography>
        </Box>

        {/* Bottom — large car name */}
        <Box sx={{
          position:  'absolute',
          bottom:    `calc(${STRIP_H}px + 3rem)`,
          left:      '2.5rem',
          right:     '2.5rem',
          zIndex:    2,
        }}>
          <Typography sx={{
            fontSize:      'clamp(36px, 6vw, 88px)',
            fontWeight:    100,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight:    0.95,
            color:         'rgba(255,255,255,0.96)',
            textShadow:    '0 4px 32px rgba(0,0,0,0.7)',
          }}>
            {car.displayName}
          </Typography>
          <Typography sx={{
            fontSize:      '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.38)',
            mt:            '0.75rem',
          }}>
            {car.specs.engine}
          </Typography>
        </Box>

        {/* Scroll hint → specs */}
        <ScrollHint
          label="Specs"
          onClick={() => scrollTo(2)}
          bottom={`calc(${STRIP_H}px + 1rem)`}
        />

        {/* Back to viewer — top-right */}
        <IconButton
          onClick={() => scrollTo(0)}
          sx={{
            position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 10,
            color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff' },
          }}
        >
          <KeyboardArrowUp />
        </IconButton>

        <MakeStrip activeMake={make} />
      </Box>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — Spec spread (magazine data page)
          ══════════════════════════════════════════════════════════════════════ */}
      <Box sx={{
        height:          '100vh',
        scrollSnapAlign: 'start',
        position:        'relative',
        flexShrink:      0,
        display:         'flex',
        flexDirection:   'column',
        px:              '3rem',
        pt:              '4.5rem',
        pb:              `calc(${STRIP_H}px + 1.5rem)`,
        background:      '#0a0a0a',
        overflow:        'hidden',
      }}>
        {/* Header */}
        <Box sx={{ mb: '0.25rem' }}>
          <Typography sx={{
            fontSize:      '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.28)',
            mb:            '0.3rem',
          }}>
            {car.year} / {car.make}
          </Typography>
          <Typography sx={{
            fontSize:      'clamp(22px, 2.8vw, 38px)',
            fontWeight:    200,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.92)',
          }}>
            {car.displayName}
          </Typography>
        </Box>

        <Rule my="1.5rem" />

        {/* ── Hero stats row: Power · Top Speed · 0-60 ── */}
        <Box sx={{ display: 'flex', width: '100%', mb: '0.25rem' }}>
          <HeroStat label="Power"     value={car.specs.power}       />
          <HeroStat label="Top Speed" value={car.specs.topSpeed}    />
          <HeroStat label="0 – 60"    value={car.specs.zeroToSixty} />
        </Box>

        <Rule my="1.5rem" />

        {/* ── Secondary specs row: Engine · Torque · Weight ── */}
        <Box sx={{ display: 'flex', width: '100%' }}>
          <SecondarySpec label="Engine" value={car.specs.engine} />
          <SecondarySpec label="Torque" value={car.specs.torque} />
          <SecondarySpec label="Weight" value={car.specs.weight} />
        </Box>

        <Rule my="1.5rem" />

        {/* ── Description ── */}
        <Typography sx={{
          fontSize:   '13px',
          lineHeight: 1.9,
          color:      'rgba(255,255,255,0.42)',
          flex:       1,
          overflow:   'hidden',
        }}>
          {car.description}
        </Typography>

        {/* ── Bottom bar: back ↑ + close ── */}
        <Box sx={{
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'center',
          mt:              '1.25rem',
          pt:              '1rem',
          borderTop:       '0.5px solid rgba(255,255,255,0.07)',
        }}>
          <IconButton
            onClick={() => scrollTo(1)}
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

        <MakeStrip activeMake={make} />
      </Box>
    </Box>
  );
}
