import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getCarsByMake, ALL_MAKES } from '../components/CarGallery/cars.config';
import { CarThumbnail } from '../components/CarGallery/CarThumbnail';
import DropdownNav from '../components/common/DropdownNav';

export default function MakeSelectionPage() {
  const navigate       = useNavigate();
  const { make = '' }  = useParams<{ make: string }>();
  const cars           = getCarsByMake(make);

  // If the make has no cars, fall back to gallery
  if (cars.length === 0) {
    return (
      <Box sx={{ background: '#0a0a0a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No cars found for "{make}".</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', position: 'relative' }}>
      <DropdownNav activeOverride="Gallery" />

      {/* Back */}
      <IconButton
        onClick={() => navigate('/gallery')}
        sx={{ position: 'fixed', top: 60, left: 24, zIndex: 100, color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
      >
        <ArrowBack />
      </IconButton>

      {/* Make header */}
      <Box sx={{ pt: '120px', pb: '3rem', px: '5vw' }}>
        <Typography sx={{
          fontSize:      '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.3)',
          mb:            '0.5rem',
        }}>
          Gallery / {make}
        </Typography>
        <Typography variant="h3" sx={{
          fontWeight:    200,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.92)',
        }}>
          {make}
        </Typography>
      </Box>

      {/* Car cards */}
      <Box sx={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap:                 '1px',
        px:                  '5vw',
        pb:                  '4rem',
      }}>
        {cars.map((car) => (
          <Box
            key={car.slug}
            onClick={() => navigate(`/gallery/${make}/${car.slug}`)}
            sx={{
              cursor:         'pointer',
              position:       'relative',
              aspectRatio:    '16 / 9',
              background:     '#111',
              border:         '0.5px solid rgba(255,255,255,0.08)',
              display:        'flex',
              flexDirection:  'column',
              justifyContent: 'flex-end',
              padding:        '1.25rem',
              overflow:       'hidden',
              transition:     'border-color 0.3s',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover .car-label': { color: '#fff' },
            }}
          >
            {/* Live 3D thumbnail — FM4-style studio render, consistent across all cars */}
            <CarThumbnail config={car} />

            {/* Gradient overlay — darker at bottom so label stays readable */}
            <Box sx={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)',
              pointerEvents: 'none',
              zIndex:     1,
            }} />

            {/* Card label */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography className="car-label" sx={{
                fontSize:      '18px',
                fontWeight:    300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.75)',
                transition:    'color 0.2s',
              }}>
                {car.displayName}
              </Typography>
              <Typography sx={{
                fontSize:      '11px',
                letterSpacing: '0.14em',
                color:         'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                mt:            '2px',
              }}>
                {car.year} · {car.country}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* All makes strip at bottom */}
      <MakeStrip activeMake={make} />
    </Box>
  );
}

// ─── Shared constant: pixel height of the fixed MakeStrip ────────────────────
// Used by sibling pages (Car3DBackgroundPage, IndividualCarPage) to clear the
// strip when positioning their own bottom-anchored elements.
export const STRIP_H = 68; // px — keep in sync with py below (2 × 22px + ~24px text)

// ─── Reusable make emblem strip ───────────────────────────────────────────────
export function MakeStrip({ activeMake }: { activeMake?: string }) {
  const navigate = useNavigate();

  return (
    <Box sx={{
      position:       'fixed',
      bottom:         0,
      left:           0,
      right:          0,
      height:         `${STRIP_H}px`,
      zIndex:         100,
      display:        'flex',
      alignItems:     'center',
      background:     'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(16px)',
      borderTop:      '0.5px solid rgba(255,255,255,0.1)',
    }}>
      {ALL_MAKES.map((make) => {
        const isActive = make === activeMake;
        return (
          <Box
            key={make}
            onClick={() => navigate(`/gallery/${make}`)}
            sx={{
              flex:           1,
              height:         '100%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              borderRight:    '0.5px solid rgba(255,255,255,0.06)',
              borderBottom:   isActive ? '2px solid rgba(255,255,255,0.75)' : '2px solid transparent',
              transition:     'background 0.2s',
              '&:hover':      { background: 'rgba(255,255,255,0.05)' },
              '&:last-child': { borderRight: 'none' },
            }}
          >
            <Typography sx={{
              fontSize:      '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.32)',
              fontWeight:    isActive ? 600 : 400,
              transition:    'color 0.2s',
            }}>
              {make}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
