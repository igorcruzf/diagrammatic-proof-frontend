import React, {useState} from "react";
import {linkDataEntry, nodeDataEntry} from "../Diagram/DiagramsArea";
import {calculateDiagrammaticProof} from "../../services/DiagrammaticProofService";
import "./RelationsInputForm.css"
import OperatorButtons from "../OperatorsButtons/OperatorButtons";

export const composition = "ο"
export const intersection = "∩"
export const inverse = "⁻¹"

export default function RelationsInputForm(props: {
    setDiagrammaticProof: Function
}) {
    const [leftDiagramInput, setLeftDiagramInput] = useState<string>("(A" + composition + "B)" + inverse);
    const [rightDiagramInput, setRightDiagramInput] = useState<string>("A" + intersection + "B");

    function handleLeftDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        setLeftDiagramInput(event.currentTarget.value);
    }

    function handleRightDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        setRightDiagramInput(event.currentTarget.value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const leftInput = transformInput(leftDiagramInput)
        const rightInput = transformInput(rightDiagramInput)
        calculateDiagrammaticProof(leftInput + "inc" + rightInput).then(
            diagrammaticProofResponse => {
                props.setDiagrammaticProof(diagrammaticProofResponse)
            }
        )
    }

    function transformInput(input: string){
        return input
            .replaceAll(composition, "comp")
            .replaceAll(intersection, "int")
            .replaceAll(inverse, "inv")
    }

    return (
        <form className={'form'} onSubmit={handleSubmit}>
            <div id={"relations-input"}>
                <div>
                    <input type="text" value={leftDiagramInput} onChange={handleLeftDiagramInputChange} />
                    <OperatorButtons input={leftDiagramInput} setInput={setLeftDiagramInput}/>
                </div>
                <img id={'subset-eq'} src='images/subseteq.png' alt="Subset equals"/>
                <div className={"right-input"}>
                    <input type="text" value={rightDiagramInput} onChange={handleRightDiagramInputChange} />
                    <OperatorButtons input={rightDiagramInput} setInput={setRightDiagramInput}/>
                </div>
            </div>
            <input className={'submit-button'} type="submit" value="Submit" />
        </form>
    );
}