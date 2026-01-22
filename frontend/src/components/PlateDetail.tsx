import {JSX, useState} from "react";
import {Box, CardMedia, Divider, Typography} from "@mui/material"
import {Plate} from "../models/Plate";

interface PlateDetailProps {
    dish: Plate
}

export function PlateDetail(props :PlateDetailProps): JSX.Element {
    const [dishName] = useState(props.dish.name ?? "Null");


    return (
        <Box>
            <Typography>
                {dishName}
            </Typography>
            <Divider/>
            <CardMedia/>
            <Typography>
                Lorem Ipsum
            </Typography>
        </Box>
    )
}

export default PlateDetail