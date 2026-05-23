import React from 'react';
import { Box, Typography } from '@mui/material';
import DropdownNav from '../components/common/DropdownNav';

export default function TravelPage() {
  return (
    <Box sx={{
      height:     '100vh',
      background: '#0a0a0a',
      color:      '#fff',
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <DropdownNav activeOverride="Travel" />
      <Typography sx={{
        fontSize:      '10px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color:         'rgba(255,255,255,0.25)',
      }}>
        Coming Soon
      </Typography>
      <Typography variant="h3" sx={{
        fontWeight:    200,
        letterSpacing: '0.06em',
        color:         'rgba(255,255,255,0.6)',
      }}>
        Travel
      </Typography>
      <Typography sx={{
        fontSize: '13px',
        color:    'rgba(255,255,255,0.25)',
        maxWidth: '30ch',
        textAlign: 'center',
        lineHeight: 1.7,
      }}>
        Locations, routes, and moments from Hong Kong, Japan, and beyond.
      </Typography>
    </Box>
  );
}
