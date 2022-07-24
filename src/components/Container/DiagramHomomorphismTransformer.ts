import {DiagrammaticProofServiceResponse} from "../../services/DiagrammaticProofInterfaces";
import {DiagrammaticProofState} from "./Container";

export default function createHomomorphicState(diagrammaticProof: DiagrammaticProofServiceResponse,
                                               diagrammaticProofState: DiagrammaticProofState
) {
    const newLeftStates = structuredClone(diagrammaticProofState.leftDiagram)
    const newRightStates = structuredClone(diagrammaticProofState.rightDiagram)

    let index = 0
    for(let key in newRightStates.nodeDict){
        const node = diagrammaticProof.right_diagrammatic_proof.diagrams.at(-1)!.nodes.find(node =>
            node.name === key
        )!

        if(newLeftStates.nodeDict[node.image_name!].color !== "black") {
            newRightStates.nodeDict[key].color = newLeftStates.nodeDict[node.image_name!].color
        } else {
            newRightStates.nodeDict[key].color = colorList[index]
            newLeftStates.nodeDict[node.image_name!].color = colorList[index]
            index+=1
        }

        if(index === colorList.length){
            index = 0
        }
    }
    newLeftStates.feedBackMessage = "Showing homomorphism"
    newRightStates.feedBackMessage = "Showing homomorphism"
    return {
        leftDiagram: newLeftStates,
        rightDiagram: newRightStates
    }
}


export function createNonHomomorphicState(diagrammaticProof: DiagrammaticProofServiceResponse,
                                               diagrammaticProofState: DiagrammaticProofState
) {
    const newLeftStates = structuredClone(diagrammaticProofState.leftDiagram)

    for(let key in newLeftStates.nodeDict){
        newLeftStates.nodeDict[key].text = diagrammaticProof.countermodel.universe[key]
    }
    return {
        leftDiagram: newLeftStates,
        rightDiagram: diagrammaticProofState.rightDiagram
    }
}
export const colorList = [
    "Blue",
    "Red",
    "Yellow",
    "Green",
    "Orange",
    "Purple",
    "Pink",
    "Lime",
    "Aqua",
    "Olive",
    "Fuchsia",
    "Brown",
    "Aquamarine",
    "Bisque",
    "BlueViolet",
    "BurlyWood",
    "CadetBlue",
    "Chartreuse",
    "Chocolate",
    "Coral",
    "CornflowerBlue",
    "Crimson",
    "Cyan",
    "DarkBlue",
    "DarkCyan",
    "DarkGoldenRod",
    "DarkGray",
    "DarkGrey",
    "DarkGreen",
    "DarkKhaki",
    "DarkMagenta",
    "DarkOliveGreen",
    "DarkOrange",
    "DarkOrchid",
    "DarkRed",
    "DarkSalmon",
    "DarkSeaGreen",
    "DarkSlateBlue",
    "DarkSlateGray",
    "DarkSlateGrey",
    "DarkTurquoise",
    "DarkViolet",
    "DeepPink",
    "DeepSkyBlue",
    "DimGray",
    "DimGrey",
    "DodgerBlue",
    "FireBrick",
    "ForestGreen",
    "Gainsboro",
    "Gold",
    "GoldenRod",
    "Gray",
    "Grey",
    "GreenYellow",
    "HoneyDew",
    "HotPink",
    "IndianRed",
    "Indigo",
    "Ivory",
    "Khaki",
    "Lavender",
    "LavenderBlush",
    "LawnGreen",
    "LemonChiffon",
    "LightBlue",
    "LightCoral",
    "LightCyan",
    "LightGoldenRodYellow",
    "LightGray",
    "LightGrey",
    "LightGreen",
    "LightPink",
    "LightSalmon",
    "LightSeaGreen",
    "LightSkyBlue",
    "LightSlateGray",
    "LightSlateGrey",
    "LightSteelBlue",
    "LightYellow",
    "LimeGreen",
    "Linen",
    "Magenta",
    "Maroon",
    "MediumAquaMarine",
    "MediumBlue",
    "MediumOrchid",
    "MediumPurple",
    "MediumSeaGreen",
    "MediumSlateBlue",
    "MediumSpringGreen",
    "MediumTurquoise",
    "MediumVioletRed",
    "MidnightBlue",
    "MintCream",
    "MistyRose",
    "Moccasin",
    "NavajoWhite",
    "Navy",
    "OliveDrab",
    "OrangeRed",
    "Orchid",
    "PaleGoldenRod",
    "PaleGreen",
    "PaleTurquoise",
    "PaleVioletRed",
    "PapayaWhip",
    "PeachPuff",
    "Peru",
    "Plum",
    "PowderBlue",
    "RebeccaPurple",
    "RosyBrown",
    "RoyalBlue",
    "SaddleBrown",
    "Salmon",
    "SandyBrown",
    "SeaGreen",
    "Sienna",
    "Silver",
    "SkyBlue",
    "SlateBlue",
    "SlateGray",
    "SlateGrey",
    "SpringGreen",
    "SteelBlue",
    "Tan",
    "Teal",
    "Thistle",
    "Tomato",
    "Turquoise",
    "Violet",
    "Wheat",
    "YellowGreen"
]

