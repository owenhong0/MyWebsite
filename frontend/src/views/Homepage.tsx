import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronRight, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DropdownNav from '../components/common/DropdownNav';

// ─── Section card used for Gallery / Travel ────────────────────────────────
interface SectionCardProps {
  label:       string;
  title:       string;
  description: string;
  path:        string;
  accent?:     string;
}

function SectionCard({ label, title, description, path, accent = '#fff' }: SectionCardProps) {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate(path)}
      sx={{
        cursor:         'pointer',
        display:        'flex',
        flexDirection:  'column',
        gap:            '0.5rem',
        padding:        '1.5rem',
        border:         '0.5px solid rgba(255,255,255,0.1)',
        borderRadius:   '2px',
        background:     'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(8px)',
        transition:     'border-color 0.2s, background 0.2s',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.3)',
          background:  'rgba(255,255,255,0.06)',
        },
      }}
    >
      <Typography sx={{
        fontSize:      '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color:         'rgba(255,255,255,0.35)',
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize:      '1.15rem',
        fontWeight:    300,
        letterSpacing: '0.08em',
        color:         'rgba(255,255,255,0.9)',
      }}>
        {title}
      </Typography>
      <Typography sx={{
        fontSize:   '13px',
        lineHeight: 1.6,
        color:      'rgba(255,255,255,0.45)',
        maxWidth:   '28ch',
      }}>
        {description}
      </Typography>
    </Box>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────
export default function Homepage() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      height:     '100vh',
      width:      '100vw',
      background: '#0a0a0a',
      overflow:   'hidden',
      position:   'relative',
      color:      '#fff',
    }}>
      {/* Top nav */}
      <DropdownNav activeOverride="Gallery" />

      {/* Subtle grid texture */}
      <Box sx={{
        position:   'absolute',
        inset:      0,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents:  'none',
      }} />

      {/* Main content — horizontally centred, vertically centred */}
      <Box sx={{
        position:   'absolute',
        inset:      0,
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap:        '2.5rem',
        px:         '5vw',
      }}>
        {/* Left — hero image placeholder */}
        <Box sx={{
          flexShrink:  0,
          width:       'clamp(140px, 20vw, 240px)',
          aspectRatio: '1 / 1',
          background:  'rgba(255,255,255,0.05)',
          border:      '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '2px',
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
        }}>
          <Typography sx={{
            fontSize:      '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.2)',
          }}>
            Photo
          </Typography>
        </Box>

        {/* Right — intro text */}
        <Box sx={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '1.25rem',
          maxWidth:      '420px',
        }}>
          <Box>
            <Typography sx={{
              fontSize:      '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.35)',
              mb:            '0.5rem',
            }}>
              Owen Hong
            </Typography>
            <Typography variant="h4" sx={{
              fontWeight:    200,
              letterSpacing: '0.06em',
              lineHeight:    1.15,
              color:         'rgba(255,255,255,0.92)',
            }}>
              Cars, Travel,<br />and Everything Else.
            </Typography>
          </Box>

          <Typography sx={{
            fontSize:   '14px',
            lineHeight: 1.75,
            color:      'rgba(255,255,255,0.45)',
          }}>
            A personal archive of machines, places, and moments.
            Use the nav above or explore a section below.
          </Typography>

          {/* Section cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionCard
              label="Explore"
              title="Car Gallery"
              description="6 iconic machines photographed in open environments."
              path="/gallery"
            />
            <SectionCard
              label="Travel"
              title="Locations"
              description="Hong Kong, Japan, and places in between."
              path="/travel"
            />
          </Box>
        </Box>

        {/* Right arrow */}
        <IconButton
          onClick={() => navigate('/gallery')}
          sx={{
            color:          'rgba(255,255,255,0.3)',
            border:         '0.5px solid rgba(255,255,255,0.1)',
            borderRadius:   '2px',
            '&:hover': {
              color:       'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.3)',
            },
            transition:     'all 0.2s ease',
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Bottom scroll hint */}
      <Box sx={{
        position:      'absolute',
        bottom:        '2rem',
        left:          '50%',
        transform:     'translateX(-50%)',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '6px',
        opacity:       0.3,
        animation:     'bounce 2s ease-in-out infinite',
        '@keyframes bounce': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)'  },
          '50%':      { transform: 'translateX(-50%) translateY(6px)' },
        },
      }}>
        <Typography sx={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Explore
        </Typography>
        <KeyboardArrowDown sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  );
}
