import {composition, intersection, inverse} from "../RelationsInputForm/RelationsInputForm";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import './AboutPage.css'

export default function About() {

    interface rowData {
        operation: string
        symbol: string
        shortcut: string
    }

    const rows: rowData[] = [
        {operation: "Inverse", symbol: inverse, shortcut: ","},
        {operation: "Intersection", symbol: intersection, shortcut: "."},
        {operation: "Composition", symbol: composition, shortcut: ";"},
    ];
    return (
        <div>
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
        </div>
    )
}