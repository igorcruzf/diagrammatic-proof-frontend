import React, {useState} from "react";
import DiagramsArea, {linkDataEntry, nodeDataEntry} from "../Diagram/DiagramsArea";
import {customDiagram} from "../Diagram/GoCustomDiagram";
import RelationsInputForm, {transformInputToSymbol} from "../RelationsInputForm/RelationsInputForm";
import './Container.css'
import {Diagram, DiagrammaticProofServiceResponse} from "../../services/DiagrammaticProofInterfaces";
import ChangeDiagramsContainer from "../ChangeDiagramsContainer/ChangeDiagramsContainer";
import {flattenEdgeLabels} from "../../services/FlattenEdge";
import {addHypothesis, removeComposition, removeIntersection, removeInverse} from "./DiagramOperationTransformer";
import createHomomorphicState, {createNonHomomorphicState} from "./DiagramHomomorphismTransformer";
import Countermodel from "../Countermodel/Countermodel";

export interface EdgeToLinkDict {
    [edge_id: string]: linkDataEntry;
}

export interface NodeToNodeDataDict{
    [node: string]: nodeDataEntry;
}

export interface DiagramStates {
    nodeDict: NodeToNodeDataDict
    linkDict: EdgeToLinkDict
    feedBackMessage: string
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
    const [slideValue, setSlideValue] = useState<number>(0);
    const [leftSlideMaxIndex, setLeftSlideMaxIndex] = useState<number>(0);
    const [leftSlideValue, setLeftSlideValue] = useState<number>(0);
    const [rightSlideMaxIndex, setRightSlideMaxIndex] = useState<number>(0);
    const [rightSlideValue, setRightSlideValue] = useState<number>(0);
    const [leftFeedbackMessage, setLeftFeedbackMessage] = useState<string>("")
    const [rightFeedbackMessage, setRightFeedbackMessage] = useState<string>("")
    const [homomorphismFeedbackMessage, setHomomorphismFeedbackMessage] = useState<string>("")
    const [isHomomorphic, setIsHomomorphic] = useState<boolean>(false)
    const [diagrammaticProofResponse, setDiagrammaticProofResponse] = useState<DiagrammaticProofServiceResponse>()


    const leftDiagram = customDiagram()
    const rightDiagram = customDiagram()

    function handleHomomorphismFeedbackMessage(currentStateIndex: number){
        if(currentStateIndex === diagrammaticProofStates.length-1) {
            if(isHomomorphic){
                const text = document.getElementById('validation-text')!
                text.classList.add('valid-text')
                text.classList.remove('invalid-text')
                setHomomorphismFeedbackMessage("Yes")
            } else {
                const text = document.getElementById('validation-text')!
                text.classList.remove('valid-text')
                text.classList.add('invalid-text')
                setHomomorphismFeedbackMessage("No")
            }
        } else {
            setHomomorphismFeedbackMessage("")
        }
    }

    function handleDiagramsChange(currentStateIndex: number, direction: String) {
        const currentState = diagrammaticProofStates[currentStateIndex]
        handleHomomorphismFeedbackMessage(currentStateIndex)
        if(direction === "LEFT" || direction === "BOTH") {
            setLeftFeedbackMessage(currentState.leftDiagram.feedBackMessage)
            setLeftNodeDataArray(currentState.leftDiagram.nodeDict)
            setLeftLinkDataArray(currentState.leftDiagram.linkDict)
            handleLeftDiagramChange(
                getNodeDataArrayFromDict(currentState.leftDiagram.nodeDict),
                getLinkDataArrayFromDict(currentState.leftDiagram.linkDict)
            )
        }
        if(direction === "RIGHT" || direction === "BOTH"){
            setRightFeedbackMessage(currentState.rightDiagram.feedBackMessage)
            setRightNodeDataArray(currentState.rightDiagram.nodeDict)
            setRightLinkDataArray(currentState.rightDiagram.linkDict)
            handleRightDiagramChange(
                getNodeDataArrayFromDict(currentState.rightDiagram.nodeDict),
                getLinkDataArrayFromDict(currentState.rightDiagram.linkDict)
            )
        }
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
        setDiagrammaticProofResponse(diagrammaticProof)
        setHomomorphismFeedbackMessage("")
        const leftDiagramsLength = diagrammaticProof.left_diagrammatic_proof.diagrams.length
        const rightDiagramsLength = diagrammaticProof.right_diagrammatic_proof.diagrams.length
        setIsHomomorphic(diagrammaticProof.countermodel.homomorphic)
        setLeftSlideMaxIndex(leftDiagramsLength)
        setRightSlideMaxIndex(rightDiagramsLength)

        const rightDiagram = initializeDiagram(diagrammaticProof.right_diagrammatic_proof.diagrams[0], setRightNodeDataArray, setRightLinkDataArray)
        const leftDiagram = initializeDiagram(diagrammaticProof.left_diagrammatic_proof.diagrams[0], setLeftNodeDataArray, setLeftLinkDataArray)
        setLeftFeedbackMessage("Initial diagram")
        setRightFeedbackMessage("Initial diagram")

        const currentDiagrammaticProofStates = []
        currentDiagrammaticProofStates.push(
            {
                leftDiagram: leftDiagram,
                rightDiagram: rightDiagram
            }
        )
        const maxIndex = leftDiagramsLength > rightDiagramsLength ? leftDiagramsLength-1 : rightDiagramsLength-1
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
        if(diagrammaticProof.countermodel.homomorphic){
            diagrammaticProofStates.push(
                createHomomorphicState(diagrammaticProof, diagrammaticProofStates.at(-1)!)
            )
        }else {
            diagrammaticProofStates.push(
                createNonHomomorphicState(diagrammaticProof, diagrammaticProofStates.at(-1)!)
            )
        }
        setDiagrammaticProofStates(diagrammaticProofStates)
    }


    function convertDescriptionToFeedback(description: string, label?: string){
        switch (description) {
            case "BEGIN":
                return "Initial diagram"
            case "REMOVE_INVERSE":
                return `Transforming inverse in ${label!}`
            case "REMOVE_COMPOSITION":
                return `Transforming composition in ${label!}`
            case "REMOVE_INTERSECTION":
                return `Transforming intersection in ${label!}`
            default:
                return transformInputToSymbol(description)
        }
    }

    function changeDiagramState(diagramStates: DiagramStates, diagram: Diagram | null){
        if(diagram === null) return diagramStates
        const newDiagramStates = {...diagramStates}
        newDiagramStates.linkDict = {...diagramStates.linkDict}
        newDiagramStates.nodeDict = {...diagramStates.nodeDict}
        switch (diagram!.step_description) {
            case "REMOVE_INVERSE":
                removeInverse(newDiagramStates, diagram);
                break
            case "REMOVE_COMPOSITION":
                removeComposition(diagram!, newDiagramStates);
                break
            case "REMOVE_INTERSECTION":
                removeIntersection(newDiagramStates, diagram);
                break
            case "BEGIN":
                break
            default:
                addHypothesis(newDiagramStates, diagram)
                break
        }
        newDiagramStates.feedBackMessage = convertDescriptionToFeedback(diagram.step_description,
            diagram.removed_edge !== null? flattenEdgeLabels(diagram.removed_edge!) : undefined
        )
        return newDiagramStates
    }

    function getDiagram(currentIndex: number, diagrams: Diagram[]){
        if(currentIndex < diagrams.length){
            return diagrams![currentIndex]!
        } else {
            return null
        }
    }

    function initializeDiagram(diagram: Diagram, setNodeArray: Function, setLinkArray: Function){
        const nodeDict: NodeToNodeDataDict = {}
        nodeDict[diagram.nodes[0].name] =
            { key: 0, color: 'black', loc: '0 50', category: "Start", text: ""}

        nodeDict[diagram.nodes[1].name] =
            { key: 1, color: 'black', loc: '100 50', category: "End", text: ""}

        setNodeArray(nodeDict)
        const linkDict: EdgeToLinkDict = {}
        const flattenLabel = flattenEdgeLabels(diagram.edges[0])
        linkDict[diagram.edges[0].id] = { key: -1, from: 0, to: 1, text: flattenLabel }
        setLinkArray(linkDict)
        return {nodeDict, linkDict, feedBackMessage: convertDescriptionToFeedback(diagram.step_description)}
    }

    function getNodeDataArrayFromDict(nodeDict: NodeToNodeDataDict){
        return Object.values(nodeDict)
    }

    function getLinkDataArrayFromDict(linkDict: EdgeToLinkDict){
        return Object.values(linkDict)
    }

    function resetSlidesValue(){
        setRightSlideValue(0)
        setLeftSlideValue(0)
        setSlideValue(0)
    }

    return (
        <div id={'content-container'}>
            <div id={'input-container'}>
                <RelationsInputForm
                    resetSlidesValue={resetSlidesValue}
                    setDiagrammaticProof={initializeDiagrammaticProof}
                />
                <div id={'interrogation-text'}>
                    ?
                </div>
                <div id={'validation-text'} className={'invalid-text'}>
                    {homomorphismFeedbackMessage}
                </div>
            </div>
            {
                diagrammaticProofStates.length !== 0 &&
                <div>
                    <div id={'feedback-container'}>
                        <div className={'feedback'}>
                            {leftFeedbackMessage}
                        </div>
                        <div className={'feedback'}>
                            {rightFeedbackMessage}
                        </div>
                    </div>
                    <div id={"diagrams-areas"}>
                        <DiagramsArea
                            nodeDataArray={getNodeDataArrayFromDict(leftNodeDataArray)}
                            linkDataArray={getLinkDataArrayFromDict(leftLinkDataArray)}
                            diagram={leftDiagram}
                        />
                        <DiagramsArea
                            nodeDataArray={getNodeDataArrayFromDict(rightNodeDataArray)}
                            linkDataArray={getLinkDataArrayFromDict(rightLinkDataArray)}
                            diagram={rightDiagram}
                        />
                    </div>
                    <ChangeDiagramsContainer
                        slideValue={slideValue}
                        setSlideValue={setSlideValue}
                        handleDiagramsChange={handleDiagramsChange}
                        diagrammaticProofStates={diagrammaticProofStates}
                        leftMaxIndex={leftSlideMaxIndex}
                        leftSlideValue={leftSlideValue}
                        setLeftSlideValue={setLeftSlideValue}
                        rightMaxIndex={rightSlideMaxIndex}
                        rightSlideValue={rightSlideValue}
                        setRightSlideValue={setRightSlideValue}
                    />
                </div>
            }

            {homomorphismFeedbackMessage === "No" && <Countermodel diagrammaticProof={diagrammaticProofResponse!}/>}

        </div>
    );
}