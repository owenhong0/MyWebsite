import {Box, Button, Container, Menu, MenuItem, Stack} from "@mui/material";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import type { ViewState } from "./Car3DBackgroundPage"

interface MainMenuProps {
    onViewChange: (view: ViewState) => void;
}

export default function MainMenu({
    onViewChange,
}:MainMenuProps) {
    const handleClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        onViewChange("brandSelection")
    }
    return (
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
                    <Button onClick={handleClicked} variant="text">Octane</Button>
                    <Button component={Link} variant="text" to="/localeMain">Locale</Button>
                    <Button component={Link} variant="text" to="/platesMain">Plates</Button>
                    <Button component={Link} variant="text" to="/peaksMain">Peaks</Button>
                </Stack>
            </Container>
        </Box>
    )
}