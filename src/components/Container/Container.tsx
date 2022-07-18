import {useState} from "react";
import DiagramsArea, {linkDataEntry, nodeDataEntry} from "../Diagram/DiagramsArea";
import {customDiagram} from "../Diagram/GoCustomDiagram";
import RelationsInputForm from "../RelationsInputForm/RelationsInputForm";
import './Container.css'
import {Diagram, DiagrammaticProofServiceResponse} from "../../services/DiagrammaticProofInterfaces";
import ChangeDiagramsContainer from "../ChangeDiagramsContainer/ChangeDiagramsContainer";
import {flattenEdgeLabels} from "../../services/FlattenEdge";
import {removeComposition, removeIntersection, removeInverse} from "./DiagramOperationTransformer";

export interface EdgeToLinkDict {
    [edge: string]: linkDataEntry;
}

export interface NodeToNodeDataDict{
    [node: string]: nodeDataEntry;
}

export interface DiagramStates {
    nodeDict: NodeToNodeDataDict
    linkDict: EdgeToLinkDict
}

export interface DiagrammaticProofState {
    leftDiagram: DiagramStates
    rightDiagram: DiagramStates
}

export default function Container(){
    const [leftNodeDataArray, setLeftNodeDataArray] = useState<NodeToNodeDataDict>({});
    const [leftLinkDataArray, setLeftLinkDataArray] = useState<EdgeToLinkDict>({});
    const [rightNodeDataArray, setRightNodeDataArray] = useState<NodeToNodeDataDict>({});
    const [rightLinkDataArray, setRightLinkDataArray] = useState<EdgeToLinkDict>({});
    const [diagrammaticProofStates, setDiagrammaticProofStates] = useState<DiagrammaticProofState[]>([]);
    const [maxIndex, setMaxIndex] = useState<number>(0);
    const [slideValue, setSlideValue] = useState<number>(0);
    const leftDiagram = customDiagram()
    const rightDiagram = customDiagram()

    function handleDiagramsChange(currentState: DiagrammaticProofState) {
        setLeftNodeDataArray(currentState.leftDiagram.nodeDict)
        setLeftLinkDataArray(currentState.leftDiagram.linkDict)
        setRightNodeDataArray(currentState.rightDiagram.nodeDict)
        setRightLinkDataArray(currentState.rightDiagram.linkDict)
        handleLeftDiagramChange(
            getNodeDataArrayFromDict(currentState.leftDiagram.nodeDict),
            getLinkDataArrayFromDict(currentState.leftDiagram.linkDict)
        )
        handleRightDiagramChange(
            getNodeDataArrayFromDict(currentState.rightDiagram.nodeDict),
            getLinkDataArrayFromDict(currentState.rightDiagram.linkDict)
        )
    }

    function handleLeftDiagramChange(nodeData: nodeDataEntry[], linkData: linkDataEntry[]) {
        leftDiagram.model.mergeNodeDataArray(nodeData)
        // @ts-ignore
        leftDiagram.model.mergeLinkDataArray(linkData)
    }

    function handleRightDiagramChange(nodeData: nodeDataEntry[], linkData: linkDataEntry[]) {
        rightDiagram.model.mergeNodeDataArray(nodeData)
        // @ts-ignore
        rightDiagram.model.mergeLinkDataArray(linkData)
    }

    async function initializeDiagrammaticProof(diagrammaticProof: DiagrammaticProofServiceResponse) {
        const leftDiagramsLength = diagrammaticProof.left_diagrammatic_proof.diagrams.length
        const rightDiagramsLength = diagrammaticProof.right_diagrammatic_proof.diagrams.length
        const maxIndex = leftDiagramsLength > rightDiagramsLength ? leftDiagramsLength-1 : rightDiagramsLength-1
        setMaxIndex(maxIndex)

        const rightDiagram = initializeDiagram(diagrammaticProof.right_diagrammatic_proof.diagrams[0], setRightNodeDataArray, setRightLinkDataArray)
        const leftDiagram = initializeDiagram(diagrammaticProof.left_diagrammatic_proof.diagrams[0], setLeftNodeDataArray, setLeftLinkDataArray)
        const currentDiagrammaticProofStates = []
        currentDiagrammaticProofStates.push(
            {
                leftDiagram: leftDiagram,
                rightDiagram: rightDiagram
            }
        )
        handleAllStates(maxIndex, diagrammaticProof, currentDiagrammaticProofStates)
    }

    function handleAllStates(maxIndex: number,
                             diagrammaticProof: DiagrammaticProofServiceResponse,
                             diagrammaticProofStates: DiagrammaticProofState[]
    ) {
        for(let index = 1; index <= maxIndex; index++){
            const leftDiagram = getDiagram(index, diagrammaticProof.left_diagrammatic_proof.diagrams)
            const rightDiagram = getDiagram(index, diagrammaticProof.right_diagrammatic_proof.diagrams)
            const leftNewState = changeDiagramState(diagrammaticProofStates[index-1].leftDiagram, leftDiagram)
            const rightNewState = changeDiagramState(diagrammaticProofStates[index-1].rightDiagram, rightDiagram)
            diagrammaticProofStates.push({
                leftDiagram: leftNewState,
                rightDiagram: rightNewState
            })
        }
        setDiagrammaticProofStates(diagrammaticProofStates)
    }

    function changeDiagramState(diagramStates: DiagramStates, diagram: Diagram | null){
        if(diagram === null) return diagramStates
        const newDiagramStates = {...diagramStates}
        newDiagramStates.linkDict = {...diagramStates.linkDict}
        newDiagramStates.nodeDict = {...diagramStates.nodeDict}
        switch (diagram!!.step_description) {
            case "REMOVE_INVERSE":
                removeInverse(newDiagramStates, diagram);
                break
            case "REMOVE_COMPOSITION":
                removeComposition(diagram!!, newDiagramStates);
                break
            case "REMOVE_INTERSECTION":
                removeIntersection(newDiagramStates, diagram);
                break
            default:
                break
        }
        return newDiagramStates
    }

    function getDiagram(currentIndex: number, diagrams: Diagram[]){
        if(currentIndex < diagrams.length){
            return diagrams!![currentIndex]!!
        } else {
            return null
        }
    }

    function initializeDiagram(diagram: Diagram, setNodeArray: Function, setLinkArray: Function){
        const nodeDict: NodeToNodeDataDict = {}
        nodeDict[diagram.nodes[0].name] =
            { key: 0, color: 'black', loc: '0 50', category: "Start" }

        nodeDict[diagram.nodes[1].name] =
            { key: 1, color: 'black', loc: '100 50', category: "End" }

        setNodeArray(nodeDict)
        const linkDict: EdgeToLinkDict = {}
        const flattenLabel = flattenEdgeLabels(diagram.edges[0])
        linkDict[flattenLabel] = { key: -1, from: 0, to: 1, text: flattenLabel }
        setLinkArray(linkDict)
        return {nodeDict, linkDict}
    }

    function getNodeDataArrayFromDict(nodeDict: NodeToNodeDataDict){
        return Object.values(nodeDict)
    }

    function getLinkDataArrayFromDict(linkDict: EdgeToLinkDict){
        return Object.values(linkDict)
    }

    return (
        <div>
            <RelationsInputForm
                setSlideValue={setSlideValue}
                setDiagrammaticProof={initializeDiagrammaticProof}
            />
            {
                diagrammaticProofStates.length !== 0 &&
                <div>
                    <div id={"diagrams-areas"}>
                        <DiagramsArea
                            nodeDataArray={getNodeDataArrayFromDict(leftNodeDataArray)}
                            linkDataArray={getLinkDataArrayFromDict(leftLinkDataArray)}
                            diagram={leftDiagram}/>
                        <DiagramsArea nodeDataArray={getNodeDataArrayFromDict(rightNodeDataArray)}
                                      linkDataArray={getLinkDataArrayFromDict(rightLinkDataArray)}
                                      diagram={rightDiagram}/>
                    </div>
                    <ChangeDiagramsContainer
                        slideValue={slideValue}
                        setSlideValue={setSlideValue}
                        handleDiagramsChange={handleDiagramsChange}
                        diagrammaticProofStates={diagrammaticProofStates}
                        maxIndex={maxIndex}/>
                </div>
            }

        </div>
    );
}