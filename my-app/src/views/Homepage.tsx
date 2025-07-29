import {
    AppBar,
    Box,
    Button,
    Card,
    Grid,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import {JSX} from "react";
import MultiActionAreaCard from "../components/MultiActionAreaCard";
import SelectActionCards, {ActionCard} from "../components/SelectActionCard";
import {ScrollContainer} from "../components/ScrollContainer";


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

const example_cards: ActionCard[] = [
    {
        id: 1,
        type: "location",
        title: "Alidar Leaves Japan",
        description: "After consuming copious amounts of alcohol, Alidar finally departs the kingdom of Japan and heads home"
    },
    {
        id: 2,
        type: "location",
        title: "Esther works",
        description: "She workin"
    },
    {
        id: 3,
        type: "location",
        title: "Owen works",
        description: "He workin"
    },
    {
        id: 4,
        type: "location",
        title: "Juki preps to leave for NYC",
        description: "The era of JukiEats in Austin is coming to a close and a new chapter will begin in NYC this August"
    },
    {
        id: 5,
        type: "location",
        title: "Tracy explores Australia",
        description: "Rivaling Alidar's alcohol consumption, Tracky embarks on her first worldy experience in the great downunder"
    },
]

export default function Homepage(): JSX.Element {
    // super poop way of making page options now but fix later
    const pageOptions: ActionCard[] = [
        {
            id: 1,
            title: 'Location',
            description: 'Where is the council?',
        } as ActionCard,
        {
            id: 2,
            title: 'Food',
            description: 'What is the council munchin',
        } as ActionCard,
        {
            id: 3,
            title: 'Music',
            description: 'See what the council has been listening to',
        } as ActionCard,
    ];
    return (
        <Box sx={{flexGrow: 1}}>
            <ButtonAppBar/>
            <Grid container spacing={2} sx={{mb: 2}}>
                {/* Top row with stack of cards and minimap */}
                <ScrollContainer children={example_cards}/>
                <Grid size={8}>
                    <Card sx={{height: 600, boxSizing: 'border-box'}}>Mini Map</Card>
                </Grid>

                {/* Bottom row with 3 horizontal cards spanning full width */}
                <Grid size={12} sx={{display: 'flex', justifyContent: 'center'}}>
                    <SelectActionCards cards={pageOptions}/>
                </Grid>
            </Grid>
        </Box>
    );
}