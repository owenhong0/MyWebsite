import React, {JSX} from "react";
import {Container, IconButton, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";

export function LocaleMainPage(): JSX.Element {
    return (
        <Container>
            <Typography>
                Locale Main Page
            </Typography>
            <IconButton
                component={Link}
                to="/platesMain"
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
            <IconButton
                component={Link}
                to="/"
                sx={{
                    position: 'fixed',
                    left: 0,
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
                <ChevronLeft fontSize='large'/>
            </IconButton>
        </Container>
    );
}

export default LocaleMainPage