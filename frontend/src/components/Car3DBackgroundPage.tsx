import React, {useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment, useGLTF} from '@react-three/drei';
import {Box, Container, Button, Menu, MenuItem, Typography, Grid, Stack, Fade, Icon, IconButton} from '@mui/material';
import {Garage} from './Garage';
import {CarModel} from "./CarModel";
import {ChevronRight} from '@mui/icons-material';
import {Link} from 'react-router-dom';

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

    const [isDragging, setIsDragging] = useState(false);
    const [showUI, setShowUI] = useState(true);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (isDragging) {
            setShowUI(false); // Hide UI when dragging
        } else {
            // Show UI after 1 second of no dragging
            timeoutId = setTimeout(() => {
                setShowUI(true);
            }, 3000);
        }

        return () => clearTimeout(timeoutId);
    }, [isDragging]);


    return (
        <Box sx={{height: '100vh', width: '100vw'}}>
            <Canvas style={{height: '100%', width: '100%'}}
                    camera={{position: [-36.261, 2, -15.3383], rotation: [0, 0, 0], fov: 50}}>
                <Garage/>
                {/* Load the car model */}
                <CarModel modelPath={selectedCar}/>

                {/* OrbitControls for moving around the model */}
                <OrbitControls
                    onStart={() => setIsDragging(true)}
                    onEnd={() => setIsDragging(false)}
                    minAzimuthAngle={-Math.PI * (100 / 180)}  // -45 degrees
                    maxAzimuthAngle={Math.PI * (100 / 180)}   // 45 degrees
                    minPolarAngle={0}     // 30 degrees up
                    maxPolarAngle={Math.PI / 2}   // ~70 degrees down

                    // Distance constraints
                    minDistance={3}
                    maxDistance={25}

                    // Target point
                    target={[0, 4, 0]}
                    autoRotate={true}                     // Auto-spin
                    autoRotateSpeed={0.5}   // Look at 1 meter above ground
                />

                {/* Environment to simulate sunlight, etc. */}
                {/*<Environment preset="studio"/>*/}
            </Canvas>
            <IconButton
                component={Link}
                to="/localeMain"
                sx={{
                    position: 'fixed',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1000,
                    color: 'white',
                    opacity: 0,           // Hidden by default
                    '&:hover': {
                        opacity: 1,         // Show on hover
                    },
                    transition: 'opacity 0.3s ease',
                }}
            >
                <ChevronRight fontSize='large'/>
            </IconButton>

            <Fade in={showUI} timeout={500}>
                <Box>
                    <Container maxWidth={false} sx={{
                        width: "auto",
                        height: "auto",
                        position: 'absolute', top: 300, left: 350, zIndex: 100, alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',

                    }}>
                        <Stack direction="column" sx={{
                            width: "20%",
                            height: "40%",
                            alignItems: "center",
                        }} spacing={2}>
                            <Button component={Link} variant="text" to="/">Octane</Button>
                            <Button component={Link} variant="text" to="/localeMain">Locale</Button>
                            <Button component={Link} variant="text" to="/platesMain">Plates</Button>
                            <Button component={Link} variant="text" to="/peaksMain">Peaks</Button>
                        </Stack>
                    </Container>

                    {/* UI Controls */}
                    <Container sx={{position: 'absolute', top: 10, left: 10, zIndex: 10}}>
                        <Button variant="contained" color="primary" onClick={handleClickMenu}>
                            Open Menu
                        </Button>
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
                                onClick={() => setSelectedCar('/models/1997_nissan_skyline_gt-r_r33.glb')}>R33
                                Skyline</MenuItem>
                            <MenuItem onClick={() => setSelectedCar('/models/2023_Porsche_GT3RS.glb')}>Porsche 911
                                GT3
                                RS</MenuItem>
                            <MenuItem onClick={() => setSelectedCar('/models/2010-Koenigsegg-CCXR.glb')}>Koenigsegg
                                CCXR</MenuItem>
                            <MenuItem onClick={() => setSelectedCar('/models/NSX-R.glb')}>Honda NSX-R</MenuItem>
                        </Menu>
                    </Container>
                </Box>
            </Fade>
        </Box>
    );
};

export default FullscreenViewer;