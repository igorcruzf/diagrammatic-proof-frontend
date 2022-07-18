import {Diagram} from "../../services/DiagrammaticProofInterfaces";
import {flattenEdgeLabels} from "../../services/FlattenEdge";
import {EdgeToLinkDict, NodeToNodeDataDict} from "./Container";

export function removeComposition(diagram: Diagram, newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }) {
    const newNodeKey = Math.random()
    const rightEdge = flattenEdgeLabels(diagram.created_edges!![1])
    const leftEdge = flattenEdgeLabels(diagram.created_edges!![0])
    const removedEdge = flattenEdgeLabels(diagram.removed_edge!!)
    const removedLink = newDiagramStates.linkDict[removedEdge]
    const loc = newDiagramStates.nodeDict[diagram.created_edges!![0].left_node.name].loc.split(" ")

    newDiagramStates.nodeDict = moveAllNodes(newDiagramStates.nodeDict, +loc[0])

    newDiagramStates.nodeDict[diagram.created_edges!![0].right_node.name] =
        {key: newNodeKey, color: 'black', loc: `${+loc[0]} ${loc[1]}`}
    newDiagramStates.linkDict[leftEdge] =
        {key: removedLink.key, from: removedLink.from, to: newNodeKey, text: leftEdge}
    newDiagramStates.linkDict[rightEdge] =
        {key: -Math.random(), from: newNodeKey, to: removedLink.to, text: rightEdge}
}

export function removeIntersection(newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }, diagram: Diagram) {
    const leftLink = newDiagramStates.linkDict[flattenEdgeLabels(diagram!!.removed_edge!!)]
    const leftEdge = flattenEdgeLabels(diagram!!.created_edges!![0])
    const rightEdge = flattenEdgeLabels(diagram!!.created_edges!![1])
    newDiagramStates.linkDict[leftEdge] =
        {key: -Math.random(), from: leftLink.to, to: leftLink.from, text: leftEdge}
    newDiagramStates.linkDict[rightEdge] =
        {key: -Math.random(), from: leftLink.to, to: leftLink.from, text: rightEdge}
    delete newDiagramStates.linkDict[flattenEdgeLabels(diagram!!.removed_edge!!)]
}

export function removeInverse(newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }, diagram: Diagram) {
    const link = newDiagramStates.linkDict[flattenEdgeLabels(diagram!!.removed_edge!!)]
    const newEdge = flattenEdgeLabels(diagram!!.created_edges!![0])
    newDiagramStates.linkDict[newEdge] =
        {key: link.key, from: link.to, to: link.from, text: newEdge}
}

function moveAllNodes(nodeDict: NodeToNodeDataDict, minLoc: number){
    for(let key in nodeDict){
        const entry = nodeDict[key]
        const loc = entry.loc.split(" ")
        if(+loc[0] >= minLoc){
            nodeDict[key] = { key: entry.key, color: entry.color, loc: `${+loc[0]+100} ${loc[1]}`, category: entry.category}
        }
    }
    return nodeDict
}