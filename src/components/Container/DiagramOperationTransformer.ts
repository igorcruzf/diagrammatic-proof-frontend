import {Diagram} from "../../services/DiagrammaticProofInterfaces";
import {flattenEdgeLabels} from "../../services/FlattenEdge";
import {EdgeToLinkDict, NodeToNodeDataDict} from "./Container";

export function removeComposition(diagram: Diagram, newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }) {
    const newNodeKey = Math.random()
    const rightEdge = flattenEdgeLabels(diagram.created_edges!![1])
    const leftEdge = flattenEdgeLabels(diagram.created_edges!![0])

    const removedLink = newDiagramStates.linkDict[diagram.removed_edge!!.id]

    const locLeft = newDiagramStates.nodeDict[diagram.created_edges!![0].left_node.name].loc.split(" ")
    const locRight = newDiagramStates.nodeDict[diagram.created_edges!![1].right_node.name].loc.split(" ")
    const loc = locRight[0] > locLeft[0]? locRight : locLeft

    newDiagramStates.nodeDict = moveAllNodes(newDiagramStates.nodeDict, +loc[0])
    const leftNodeLoc = newDiagramStates.nodeDict[diagram.removed_edge!!.left_node.name].loc.split(" ")
    const rightNodeLoc = newDiagramStates.nodeDict[diagram.removed_edge!!.right_node.name].loc.split(" ")
    if(leftNodeLoc[0] > rightNodeLoc[0]) {
        console.log("entrou aqui")
        newDiagramStates.nodeDict[diagram.created_edges!![1].left_node.name] =
            {key: newNodeKey, color: 'black', loc: `${+loc[0]} ${+loc[1]}`}
        newDiagramStates.linkDict[diagram.created_edges!![0].id] =
            {key: removedLink.key, from: removedLink.from, to: newNodeKey, text: rightEdge}
        newDiagramStates.linkDict[diagram.created_edges!![1].id] =
            {key: -Math.random(), from: newNodeKey, to: removedLink.to, text: leftEdge}
    } else {
        newDiagramStates.nodeDict[diagram.created_edges!![0].right_node.name] =
            {key: newNodeKey, color: 'black', loc: `${+loc[0]} ${+loc[1]}`}
        newDiagramStates.linkDict[diagram.created_edges!![0].id] =
            {key: removedLink.key, from: removedLink.from, to: newNodeKey, text: leftEdge}
        newDiagramStates.linkDict[diagram.created_edges!![1].id] =
            {key: -Math.random(), from: newNodeKey, to: removedLink.to, text: rightEdge}
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