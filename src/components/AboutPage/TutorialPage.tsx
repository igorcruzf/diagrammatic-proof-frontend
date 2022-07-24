import {composition, intersection, inverse} from "../RelationsInputForm/RelationsInputForm";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import './TutorialPage.css'

export default function TutorialPage() {

    interface rowData {
        operation: string
        symbol: string
        shortcut: string
    }

    const rows: rowData[] = [
        {operation: "Inverse", symbol: inverse, shortcut: ", (comma)"},
        {operation: "Intersection", symbol: intersection, shortcut: ". (dot)"},
        {operation: "Composition", symbol: composition, shortcut: "; (semicolon)"},
    ];
    return (
        <div id={"tutorial-page-container"}>
            <div id={"tutorial-page"}>
                <div>
                    To use this application, just put an expression in the left input and another one in the right
                    input and press "Submit". Using a diagrammatic proof, the application will check whether the
                    inclusion is valid or not.
                </div>
                <div>
                    Available operations are disposed below:
                </div>
                <Table id={'operation-table'} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Available operations</TableCell>
                            <TableCell align="center">Symbol</TableCell>
                            <TableCell align="center">Keyboard Shortcut</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.operation}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{row.operation}</TableCell>
                                <TableCell align="center">{row.symbol}</TableCell>
                                <TableCell align="center">{row.shortcut}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div id={"table-note"}>
                    Note: Always use parentheses between terms to help with the transformation process.
                </div>
                <div>
                    It's possible to invert the equation by pressing the two arrows symbol and pressing "Submit" again.
                </div>
                <div>
                    After pressing "Submit", the program will show a transformation to the formal form of each side, and you
                    can use one of the sliders to see this transformation. The big slider will move both sides.
                </div>
                <div>
                    The last state of each diagram will show whether it is a valid inclusion (Yes) or not (No) above the diagrams.
                </div>
                <div>
                    If it's a valid inclusion, the last state will show a homomorphism between the diagrams. For each node on
                    the right, there will be a node on the left with the same color, representing its "image" in this homomorphism.
                </div>
                <div>
                    If it's not a valid inclusion, the last state in the left diagram will show a unique number for each node and
                    a countermodel proving that the inclusion is not valid will appears below the diagrams, using these numbers to compose the variables in a universe.
                </div>
                <div>
                    It's possible for a node on the left to keep the color black if there is no node in the diagram
                    on the right that has it as an image. It's also possible for a node on the right to have the same color
                    as another node on the right if both of them have the same image on the left.
                </div>
                <div>
                    You can move any node or edge by dragging it with the mouse, you can also zoom out or zoom in
                    using CTRL + Mouse Scroll or CTRL + '+'/'-' in a diagram.
                </div>
            </div>
        </div>
    )
}