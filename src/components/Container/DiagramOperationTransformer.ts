import {Diagram} from "../../services/DiagrammaticProofInterfaces";
import {flattenEdgeLabels} from "../../services/FlattenEdge";
import {EdgeToLinkDict, NodeToNodeDataDict} from "./Container";

export function removeComposition(diagram: Diagram, newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }) {
    const newNodeKey = Math.random()
    const locLeft = newDiagramStates.nodeDict[diagram.created_edges![0].left_node.name].loc.split(" ")
    const locRight = newDiagramStates.nodeDict[diagram.created_edges![1].right_node.name].loc.split(" ")
    const loc = +locRight[0] > +locLeft[0]? locRight : locLeft

    if(Math.abs((+locRight[0] - +locLeft[0])) <= 100) {
        newDiagramStates.nodeDict = moveAllNodes(newDiagramStates.nodeDict, +loc[0], +loc[1])
    } else {
        loc[0] = String(+loc[0] - (Math.abs((+locRight[0] - +locLeft[0]) / 2)))
        newDiagramStates.nodeDict = moveNodesVertically(newDiagramStates.nodeDict, +loc[1])
    }

    newDiagramStates.nodeDict[diagram.created_node!.name] =
        {key: newNodeKey, color: 'black', loc: `${+loc[0]} ${+loc[1]-20}`, text: ""}

    const firstEdgeFromNodeKey = newDiagramStates.nodeDict[diagram.created_edges![0].left_node.name].key
    const firstEdgeToNodeKey = newDiagramStates.nodeDict[diagram.created_edges![0].right_node.name].key

    const secondEdgeFromNodeKey = newDiagramStates.nodeDict[diagram.created_edges![1].left_node.name].key
    const secondEdgeToNodeKey = newDiagramStates.nodeDict[diagram.created_edges![1].right_node.name].key

    newDiagramStates.linkDict[diagram.created_edges![0].id] =
        {key: -Math.random(),
            from: firstEdgeFromNodeKey,
            to: firstEdgeToNodeKey,
            text: flattenEdgeLabels(diagram.created_edges![0])
        }
    newDiagramStates.linkDict[diagram.created_edges![1].id] =
        {key: -Math.random(),
            from: secondEdgeFromNodeKey,
            to: secondEdgeToNodeKey,
            text: flattenEdgeLabels(diagram.created_edges![1])
        }

    delete newDiagramStates.linkDict[diagram.removed_edge!.id]

    function moveAllNodes(nodeDict: NodeToNodeDataDict, minLoc: number, minVerticalLoc: number){
        for(let key in nodeDict){
            const entry = nodeDict[key]
            const nodeLocalization = entry.loc.split(" ")
            let locVertical = +nodeLocalization[1]
            if(+nodeLocalization[0] >= minLoc){
                nodeLocalization[0] = String(+nodeLocalization[0] + 100)
                nodeDict[key] = { key: entry.key, color: entry.color, loc: `${+nodeLocalization[0]} ${locVertical}`, category: entry.category, text: ""}
            }
            if(+nodeLocalization[1] < minVerticalLoc){
                nodeDict[key] = { key: entry.key, color: entry.color, loc: `${+nodeLocalization[0]} ${locVertical-20}`, category: entry.category, text: ""}
            }
        }
        return nodeDict
    }

    function moveNodesVertically(nodeDict: NodeToNodeDataDict, minVerticalLoc: number){
        for(let key in nodeDict){
            const entry = nodeDict[key]
            const nodeLocalization = entry.loc.split(" ")
            let locVertical = +nodeLocalization[1]
            if(+nodeLocalization[1] < minVerticalLoc){
                nodeDict[key] = { key: entry.key, color: entry.color, loc: `${+nodeLocalization[0]} ${locVertical-30}`, category: entry.category, text: ""}
            }
        }
        return nodeDict
    }

}

export function removeIntersection(newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }, diagram: Diagram) {
    const leftLink = newDiagramStates.linkDict[diagram!.removed_edge!.id]
    const leftEdge = flattenEdgeLabels(diagram!.created_edges![0])
    const rightEdge = flattenEdgeLabels(diagram!.created_edges![1])
    newDiagramStates.linkDict[diagram!.created_edges![0].id] =
        {key: -Math.random(), from: leftLink.from, to: leftLink.to, text: leftEdge}
    newDiagramStates.linkDict[diagram!.created_edges![1].id] =
        {key: -Math.random(), from: leftLink.from, to: leftLink.to, text: rightEdge}
    delete newDiagramStates.linkDict[diagram!.removed_edge!.id]
}

export function addHypothesis(newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }, diagram: Diagram) {
    const hypothesisEdge = diagram.edges.at(diagram.edges.length - 1)!
    const fromNode = newDiagramStates.nodeDict[hypothesisEdge.left_node.name]
    const toNode = newDiagramStates.nodeDict[hypothesisEdge.right_node.name]
    newDiagramStates.linkDict[hypothesisEdge.id] =
        {key: -Math.random(), from: fromNode.key, to: toNode.key, text: flattenEdgeLabels(hypothesisEdge)}
}

export function removeInverse(newDiagramStates: { nodeDict: NodeToNodeDataDict; linkDict: EdgeToLinkDict }, diagram: Diagram) {
    const link = newDiagramStates.linkDict[diagram!.removed_edge!.id]
    const newEdge = flattenEdgeLabels(diagram!.created_edges![0])
    newDiagramStates.linkDict[diagram!.created_edges![0].id] =
        {key: link.key, from: link.to, to: link.from, text: newEdge}
    delete newDiagramStates.linkDict[diagram!.removed_edge!.id]

}