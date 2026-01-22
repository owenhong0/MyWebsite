import {Container, Divider, Stack} from "@mui/material";
import {JSX} from "react";
import PlateDetail from "./PlateDetail";
import {Plate} from "../models/Plate";

interface PlatesTableProps {
    dishes: Plate[]
}

export function PlatesTable(props: PlatesTableProps): JSX.Element {
    const items = props.dishes
    return (
        <Stack direction="column">
            <Stack direction="row">
                {items.slice(0, 2).map((item: Plate) => (
                    <Container>
                        <PlateDetail
                            dish={item}
                        />
                        <Divider orientation="vertical"/>
                    </Container>
                ))}

            </Stack>
        </Stack>
    )
}

export default PlatesTable