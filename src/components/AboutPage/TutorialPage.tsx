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
                    To use this application, just put an expression on the left input and another one on the right input and press "Submit".
                    The application will validate if the inclusion is valid using a diagrammatic proof.
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
                    Note: Always utilize parenthesis between terms to help the transformation process.
                </div>
                <div>
                    It's possible to invert the equation by pressing the two arrows symbol and pressing "Submit" again.
                </div>
                <div>
                    After pressing "Submit", the program will show a transformation to the formal form of each side, and you
                    may use one of the sliders to see this transformation. The big slider will move both of the sides.
                </div>
                <div>
                    The last state of each diagram will show if it's a valid inclusion (Yes) or not (No) above the diagrams.
                </div>
                <div>
                    If it's a valid inclusion, the last state will show a homomorphism between the diagrams. Each node on
                    the right will have one node on the left with the same color, representing his "image" in this homomorphism.
                </div>
                <div>
                    It's possible that a node on the left will maintain the black color if there is no node on the right
                    diagram that has it as an image. It's also possible that a node on the right will have the same color
                    of another node on the right, if both of them have the same image on the left.
                </div>
            </div>
        </div>
    )
}