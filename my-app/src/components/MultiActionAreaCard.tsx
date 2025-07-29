import {JSX, useState} from "react";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import {ActionCard} from "./SelectActionCard";
import card1Image from "../static/images/card.png"

interface MultiActionAreaCardProp {
    card: ActionCard;
}

export default function MultiActionAreaCard(props: MultiActionAreaCardProp): JSX.Element {
    const [card] = useState(props.card);
    console.log(card)
    return (
        <Card sx={{height: 400, width: 345}}>
            <CardActionArea>
                <CardMedia
                    component={"img"}
                    height={"140"}
                    image={card1Image}
                    alt={"green iguana"}
                />
                <CardContent>
                    <Typography gutterBottom variant={"h5"} component={"div"}>
                        {`${card.title}`}
                    </Typography>
                    <Typography variant={"body2"} sx={{color: "text.secondary"}}>
                        {`${card.description}`}
                    </Typography>
                </CardContent>
                <IconButton aria-label={"like"}>
                    <FavoriteIcon/>
                </IconButton>
            </CardActionArea>
            <CardActions>
                <Button size={"small"} color={"primary"}></Button>
            </CardActions>
        </Card>
    );
}