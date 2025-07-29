import * as React from "react";
import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import { useState } from "react";

export interface ActionCard {
    id: number,
    type: string,
    title: string,
    description: string,
}

interface SelectActionCardsProps {
    cards: ActionCard[]
}

function SelectActionCards(props: SelectActionCardsProps) {
    const [cards] = useState(props.cards)
    const [selectedCard, setSelectedCard] = React.useState(0);
    return (
        <Box
            sx={{display: 'flex', justifyContent: 'center', gap: 2}}
        >
            {cards.map((card, index) => (
                <Card>
                    <CardActionArea
                        onClick={() => setSelectedCard(index)}
                        data-active={selectedCard === index ? '' : undefined}
                        sx={{
                            height: '100%',
                            '&[data-active]': {
                                backgroundColor: 'action.selected',
                                '&:hover': {
                                    backgroundColor: 'action.selectedHover',
                                },
                            },
                        }}
                    >
                        <CardContent sx={{height: '100%'}}>
                            <Typography variant="h5" component="div">
                                {card.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {card.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
}

export default SelectActionCards;