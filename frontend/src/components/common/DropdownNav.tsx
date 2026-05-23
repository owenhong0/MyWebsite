import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Gallery', path: '/gallery' },
  { label: 'Travel',  path: '/travel'  },
  { label: 'Email',   path: '/email'   },
  { label: 'Archive', path: '/archive' },
];

interface DropdownNavProps {
  /** Force a particular item active regardless of current URL */
  activeOverride?: string;
}

export default function DropdownNav({ activeOverride }: DropdownNavProps) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        position:       'fixed',
        top:            0,
        left:           '50%',
        transform:      'translateX(-50%)',
        zIndex:         200,
        display:        'flex',
        gap:            '2.5rem',
        padding:        '10px 2rem',
        background:     'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom:   '0.5px solid rgba(255,255,255,0.08)',
        borderRadius:   '0 0 12px 12px',
      }}
    >
      {NAV_ITEMS.map(({ label, path }) => {
        const isActive = activeOverride
          ? activeOverride === label
          : pathname.startsWith(path);

        return (
          <Typography
            key={label}
            onClick={() => navigate(path)}
            sx={{
              fontSize:      '11px',
              fontWeight:    500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:         isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)',
              cursor:        'pointer',
              transition:    'color 0.2s ease',
              userSelect:    'none',
              '&:hover':     { color: 'rgba(255,255,255,0.75)' },
            }}
          >
            {label}
          </Typography>
        );
      })}
    </Box>
  );
}
