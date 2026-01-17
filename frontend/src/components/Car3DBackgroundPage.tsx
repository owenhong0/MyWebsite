import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Box, Container, Button, Menu, MenuItem, Typography } from '@mui/material';
import CarModel from './CarModel'; // Import the CarModel component

// 3D Garage Component (using simple geometry for demonstration)
const GarageBackground = () => {
  return (
    <>
      <mesh position={[-10, -5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[30, 30, 30]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      {/* Optional: Add lighting or other details to simulate a garage */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  );
};

const FullscreenViewer = () => {
  const [modelPath, setModelPath] = useState('/models/nsx.glb');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);  // Explicitly typing state
  const [openMenu, setOpenMenu] = useState(false);

  // Handling dropdown menu opening
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);  // Correctly assign currentTarget
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Canvas style={{ height: '100%', width: '100%' }} camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Garage background */}
        <GarageBackground />

        {/* Load the car model */}
        <CarModel modelPath={modelPath} />

        {/* OrbitControls for moving around the model */}
        <OrbitControls />

        {/* Environment to simulate sunlight, etc. */}
        <Environment preset="sunset" />
      </Canvas>

      {/* UI Controls */}
      <Container sx={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <Button variant="contained" color="primary" onClick={handleClickMenu}>
          Open Menu
        </Button>

        {/* Menu for selecting options */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              maxHeight: 200,
              width: 200,
            },
          }}
        >
          <MenuItem onClick={() => setModelPath('/models/nsx.glb')}>NSX Model</MenuItem>
          <MenuItem onClick={() => setModelPath('/models/another_car.glb')}>Another Car</MenuItem>
        </Menu>

        {/* Title or other UI elements */}
        <Typography variant="h5" sx={{ position: 'absolute', top: 50, left: 10 }}>
          3D Car Viewer
        </Typography>
      </Container>
    </Box>
  );
};

export default FullscreenViewer;
