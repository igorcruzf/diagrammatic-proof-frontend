import {ReactDiagram} from "gojs-react";
import React from "react";
import {Diagram} from "gojs";
import './DiagramsArea.css';

export interface linkDataEntry{
    key: number, from: number, to: number, text: string
}

export interface nodeDataEntry{
    key: number, color: string, loc: string, category?: string
}

export default function DiagramsArea(props: {
    nodeDataArray: nodeDataEntry[],
    linkDataArray: linkDataEntry[],
    diagram: Diagram
}) {
    return <div>
            <ReactDiagram
                initDiagram={() => props.diagram}
                divClassName='diagram-component'
                nodeDataArray={props.nodeDataArray}
                linkDataArray={props.linkDataArray}
            />
        </div>
}
