import {JSX, useState} from "react";
import {Grid, Stack, Typography} from "@mui/material";
import MultiActionAreaCard from "./MultiActionAreaCard";
import * as React from "react";
import {ActionCard} from "./SelectActionCard";

export interface ScrollContainerProps {
    children: ActionCard[];
}

export function ScrollContainer(props: ScrollContainerProps): JSX.Element {
    const [cards] = useState(props.children)
    return (
        <Grid size={4} sx={{height: 600, overflow: "auto", scrollBehavior: "smooth", scrollbarWidth: "none"}}>
            {cards.length >> 0 ?
                <Stack spacing={2} alignItems={"center"} padding={1} sx={{height: 600}}>
                    {cards.map((card) => {
                        return <MultiActionAreaCard card={card}/>
                    })
                    }
                </Stack>
                : <Typography color={"error"} variant={"body2"}>
                    There was no data to populate this stack
                </Typography>}
        </Grid>
    )
}