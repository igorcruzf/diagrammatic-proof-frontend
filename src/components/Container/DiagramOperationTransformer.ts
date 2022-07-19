import {Diagram} from "../../services/DiagrammaticProofInterfaces";
import {flattenEdgeLabels} from "../../services/FlattenEdge";
import {EdgeToLinkDict, NodeToNodeDataDict} from "./Container";

export function removeComposition(diagram: Diagram, newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }) {
    const newNodeKey = Math.random()

    const locLeft = newDiagramStates.nodeDict[diagram.created_edges!![0].left_node.name].loc.split(" ")
    const locRight = newDiagramStates.nodeDict[diagram.created_edges!![1].right_node.name].loc.split(" ")
    const loc = +locRight[0] > +locLeft[0]? locRight : locLeft

    if(Math.abs((+locRight[0] - +locLeft[0])) <= 100) {
        newDiagramStates.nodeDict = moveAllNodes(newDiagramStates.nodeDict, +loc[0])
    } else {
        loc[0] = String(+loc[0] - (Math.abs((+locRight[0] - +locLeft[0]) / 2)))
    }

    createNodesAndLink(diagram.created_node!!.name);
    delete newDiagramStates.linkDict[diagram.removed_edge!!.id]

    function createNodesAndLink(nodeName: string) {
        newDiagramStates.nodeDict[nodeName] =
            {key: newNodeKey, color: 'black', loc: `${+loc[0]} ${+loc[1]-10}`}

        const firstEdgeFromNodeKey = newDiagramStates.nodeDict[diagram.created_edges!![0].left_node.name].key
        const firstEdgeToNodeKey = newDiagramStates.nodeDict[diagram.created_edges!![0].right_node.name].key

        const secondEdgeFromNodeKey = newDiagramStates.nodeDict[diagram.created_edges!![1].left_node.name].key
        const secondEdgeToNodeKey = newDiagramStates.nodeDict[diagram.created_edges!![1].right_node.name].key

        newDiagramStates.linkDict[diagram.created_edges!![0].id] =
            {key: -Math.random(), from: firstEdgeFromNodeKey, to: firstEdgeToNodeKey, text: flattenEdgeLabels(diagram.created_edges!![0])}
        newDiagramStates.linkDict[diagram.created_edges!![1].id] =
            {key: -Math.random(), from: secondEdgeFromNodeKey, to: secondEdgeToNodeKey, text: flattenEdgeLabels(diagram.created_edges!![1])}
    }
}

export function removeIntersection(newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }, diagram: Diagram) {
    const leftLink = newDiagramStates.linkDict[diagram!!.removed_edge!!.id]
    const leftEdge = flattenEdgeLabels(diagram!!.created_edges!![0])
    const rightEdge = flattenEdgeLabels(diagram!!.created_edges!![1])
    newDiagramStates.linkDict[diagram!!.created_edges!![0].id] =
        {key: -Math.random(), from: leftLink.from, to: leftLink.to, text: leftEdge}
    newDiagramStates.linkDict[diagram!!.created_edges!![1].id] =
        {key: -Math.random(), from: leftLink.from, to: leftLink.to, text: rightEdge}
    delete newDiagramStates.linkDict[diagram!!.removed_edge!!.id]
}

export function removeInverse(newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }, diagram: Diagram) {
    const link = newDiagramStates.linkDict[diagram!!.removed_edge!!.id]
    const newEdge = flattenEdgeLabels(diagram!!.created_edges!![0])
    newDiagramStates.linkDict[diagram!!.created_edges!![0].id] =
        {key: link.key, from: link.to, to: link.from, text: newEdge}
    delete newDiagramStates.linkDict[diagram!!.removed_edge!!.id]

}

function moveAllNodes(nodeDict: NodeToNodeDataDict, minLoc: number){
    for(let key in nodeDict){
        const entry = nodeDict[key]
        const loc = entry.loc.split(" ")
        let locVertical = +loc[1]
        if(+loc[0] >= minLoc){
            nodeDict[key] = { key: entry.key, color: entry.color, loc: `${+loc[0]+100} ${locVertical}`, category: entry.category}
        }
    }
    return nodeDict
}