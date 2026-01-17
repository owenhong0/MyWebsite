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
import SimpleMap from "../components/SimpleMap";


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
        title: "Kowloon, Hong Kong",
        description: "Exchange Program Semester B @ City University of Hong Kong"
    },
    {
        id: 2,
        type: "location",
        title: "Sapporo, Japan",
        description: "Dec 21st - Dec 26th"
    },
    {
        id: 3,
        type: "location",
        title: "Kyoto, Japan",
        description: "Dec 27th - Dec 30th"
    },
    {
        id: 4,
        type: "location",
        title: "Tokyo, Japan",
        description: "Dec 30th - Jan 4th"
    },
]

export default function Homepage(): JSX.Element {
    // super poop way of making page options now but fix later
    const pageOptions: ActionCard[] = [
        {
            id: 1,
            title: 'Location',
            description: 'Traveling, Studying, and Work places',
        } as ActionCard,
        {
            id: 2,
            title: 'Food',
            description: 'Recent Eats',
        } as ActionCard,
        {
            id: 3,
            title: 'Cars',
            description: 'Gallery',
        } as ActionCard,
    ];
    return (
        <Box sx={{flexGrow: 1}}>
            {/*<ButtonAppBar/>*/}
            {/*<Grid container spacing={2} sx={{margin: 2}}>*/}
            {/*    /!* Top row with stack of cards and minimap *!/*/}
            {/*    <ScrollContainer children={example_cards}/>*/}
            {/*    <Grid container sx={{maxHeight: 600, boxSizing: 'border-box', width: 950}}>*/}
            {/*        /!*<Card >Mini Map</Card>*!/*/}
            {/*        <SimpleMap/>*/}
            {/*    </Grid>*/}

            {/*    /!* Bottom row with 3 horizontal cards spanning full width *!/*/}
            {/*    <Grid size={12} sx={{display: 'flex', justifyContent: 'center'}}>*/}
            {/*        <SelectActionCards cards={pageOptions}/>*/}
            {/*    </Grid>*/}
            {/*</Grid>*/}

        </Box>
    );
}