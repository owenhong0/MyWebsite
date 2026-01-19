import React, {useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment, useGLTF} from '@react-three/drei';
import {Box, Container, Button, Menu, MenuItem, Typography} from '@mui/material';
import {Garage} from './Garage';
import {CarModel} from "./CarModel";

const FullscreenViewer = () => {
    const [selectedCar, setSelectedCar] = useState("/models/1997_nissan_skyline_gt-r_r33.glb");
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
        <Box sx={{height: '100vh', width: '100vw'}}>
            <Canvas style={{height: '100%', width: '100%'}}
                    camera={{position: [-36.261, 2, -15.3383], rotation: [0, 0, 0], fov: 50}}>
                <Garage/>
                {/* Load the car model */}
                <CarModel modelPath={selectedCar}/>

                {/* OrbitControls for moving around the model */}
                <OrbitControls
                    minAzimuthAngle={-Math.PI / 4}  // -45 degrees
                    maxAzimuthAngle={Math.PI / 4.1}   // 45 degrees
                    minPolarAngle={0}     // 30 degrees up
                    maxPolarAngle={Math.PI / 2}   // ~70 degrees down

                    // Distance constraints
                    minDistance={3}
                    maxDistance={25}

                    // Target point
                    target={[0, 1, 0]}
                    autoRotate={true}                     // Auto-spin
                    autoRotateSpeed={0.5}   // Look at 1 meter above ground
                />

                {/* Environment to simulate sunlight, etc. */}
                {/*<Environment preset="studio"/>*/}
            </Canvas>

            {/* UI Controls */}
            <Container sx={{position: 'absolute', top: 10, left: 10, zIndex: 10}}>
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
                    <MenuItem
                        onClick={() => setSelectedCar('/models/1997_nissan_skyline_gt-r_r33.glb')}>R33 Skyline</MenuItem>
                    <MenuItem onClick={() => setSelectedCar('/models/2023_porsche_911_gt3_rs.glb')}>Porsche 911 GT3 RS</MenuItem>
                    <MenuItem onClick={() => setSelectedCar('/models/2010-Koenigsegg-CCXR.glb')}>Koenigsegg CCXR</MenuItem>
                    <MenuItem onClick={() => setSelectedCar('/models/NSX-R.glb')}>Honda NSX-R</MenuItem>
                </Menu>

                {/* Title or other UI elements */}
                <Typography variant="h5" sx={{position: 'absolute', top: 50, left: 10}}>
                    3D Car Viewer
                </Typography>
            </Container>
        </Box>
    );
};

export default FullscreenViewer;