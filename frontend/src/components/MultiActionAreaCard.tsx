import {JSX, useState} from "react";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Typography
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
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
                    height={"240"}
                    image={card1Image}
                    alt={"green iguana"}
                />
                <CardContent>
                    <Typography gutterBottom variant={"h5"} component={"div"}>
                        {`${card.title}`}
                    </Typography>
                    <Typography variant={"body2"} sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "text.secondary",
                    }}>
                        {`${card.description}`}
                    </Typography>
                </CardContent>
                <Grid container padding={2}>
                    <IconButton aria-label={"like"}>
                        <FavoriteIcon/>
                    </IconButton>
                    <IconButton aria-label={"comment"}>
                        <CommentIcon/>
                    </IconButton>
                </Grid>
            </CardActionArea>
            <CardActions>
                <Button size={"small"} color={"primary"}></Button>
            </CardActions>
        </Card>
    );
}