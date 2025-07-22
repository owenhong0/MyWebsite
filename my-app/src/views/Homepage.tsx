import {AppBar, Box, Button, Card, Grid, IconButton, Paper, Stack, styled, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import {JSX} from "react";
import MultiActionAreaCard from "./MultiActionAreaCard";
import SelectActionCard from "./SelectActionCard";


export function ButtonAppBar(): JSX.Element {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton
                        size={"large"}
                        edge={"start"}
                        color={"inherit"}
                        aria-label={"menu"}
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant={"h6"} component={"div"} sx={{flexGrow: 1}}>
                        Council Book
                    </Typography>
                    <Button color={"inherit"}> Login </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default function Homepage(): JSX.Element {
    return (
        <Box sx={{flexGrow: 1}}>
            <ButtonAppBar/>
            <Grid container spacing={2} sx={{mb: 2}}>
                {/* Top row with stack of cards and minimap */}
                <Grid size={4}>
                    <Stack spacing={2} alignItems={"center"} padding={1} sx={{height: 600}}>
                        <MultiActionAreaCard/>
                        <MultiActionAreaCard/>
                        <MultiActionAreaCard/>
                    </Stack>
                </Grid>
                <Grid size={8}>
                    <Card sx={{height: 600, boxSizing: 'border-box'}}>Mini Map</Card>
                </Grid>

                {/* Bottom row with 3 horizontal cards spanning full width */}
                <Grid container>
                    <SelectActionCard/>
                </Grid>
            </Grid>
        </Box>
    );
}