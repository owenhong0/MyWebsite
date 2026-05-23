import {Box, Card, CardActionArea, CardActions, CardMedia, IconButton, Stack} from "@mui/material";
import {Link} from "react-router-dom";
import {ArrowBack, ChevronRight} from "@mui/icons-material";
import React from "react";
import type {ViewState} from "./Car3DBackgroundPage";

const imageCards = [
  { src: '/image1.jpg', title: 'Card 1', onClick: () => console.log('Clicked 1') },
  { src: '/image2.jpg', title: 'Card 2', onClick: () => console.log('Clicked 2') },
];

interface BrandSelectionProps {
    onViewChange: (view: ViewState) => void;
}

export default function BrandSelectionMenu(
    {
        onViewChange,
    }: BrandSelectionProps) {
    const handleClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        onViewChange("menu")
    }
    return (
        <Box>
            <IconButton
                onClick={handleClicked}
                sx={{
                    position: 'fixed',
                    left: '24px',
                    top: '10%',
                    transform: 'translateY(-50%)',
                    zIndex: 1000,
                    color: 'white',
                    // opacity: 0,           // Hidden by default
                    // '&:hover': {
                    //     opacity: 1,         // Show on hover
                    // },
                    // transition: 'opacity 0.3s ease',
                }}
            >
                <ArrowBack fontSize='large'/>
            </IconButton>

            <Box>
                <Stack direction='row' sx={{
                    width: "70%",
                    height: "30%",
                    alignItems: "center",
                }}>
                    {imageCards.map((card, index) => (
                        <Card key={index} sx={{ minWidth: 200, flexShrink: 0}}>
                            <CardActionArea onClick={card.onClick}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={card.src}
                                    alt={card.title}
                                />
                            </CardActionArea>
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Box>
    )
}

