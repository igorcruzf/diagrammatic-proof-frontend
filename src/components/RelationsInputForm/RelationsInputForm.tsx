import React, {RefObject, useRef, useState} from "react";
import {calculateDiagrammaticProof} from "../../services/DiagrammaticProofService";
import "./RelationsInputForm.css"
import OperatorButtons from "../OperatorsButtons/OperatorButtons";

export const composition = "ο"
export const intersection = "∩"
export const inverse = "⁻¹"

export default function RelationsInputForm(props: {
    setDiagrammaticProof: Function,
    resetSlidesValue: Function
}) {
    const [leftDiagramInput, setLeftDiagramInput] = useState<string>("(A" + composition + "B)" + inverse);
    const leftInputRef = useRef<HTMLInputElement>(null);
    const [rightDiagramInput, setRightDiagramInput] = useState<string>("A" + intersection + "B");
    const rightInputRef = useRef<HTMLInputElement>(null);

    async function handleLeftDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        await handleSetInputValue(event.currentTarget.value, leftInputRef, setLeftDiagramInput);
    }

    async function handleRightDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        await handleSetInputValue(event.currentTarget.value, rightInputRef, setRightDiagramInput);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const leftInput = transformInput(leftDiagramInput)
        const rightInput = transformInput(rightDiagramInput)
        calculateDiagrammaticProof(leftInput + "inc" + rightInput).then(
            diagrammaticProofResponse => {
                props.resetSlidesValue()
                props.setDiagrammaticProof(diagrammaticProofResponse)
            }
        )
    }

    async function handleSetInputValue(inputValue: string, inputRef: RefObject<HTMLInputElement>, setInputValue: Function) {
        let value = inputRef.current?.selectionStart

        let operationLength = 0
        if(inputValue.includes(",")) {
            operationLength = (inputValue.match(/,/g) || []).length
        }
        const newInputValue = inputValue.replaceAll(";", composition)
            .replaceAll(".", intersection)
            .replaceAll(",", inverse)

        setInputValue(newInputValue)
        await inputRef.current?.focus()

        inputRef.current?.setSelectionRange(value!! + operationLength, value!! + operationLength)
    }

    function transformInput(input: string){
        return input
            .replaceAll(composition, "comp")
            .replaceAll(intersection, "int")
            .replaceAll(inverse, "inv")
    }

    function invertInput(){
        const leftInput = leftDiagramInput
        setLeftDiagramInput(rightDiagramInput)
        setRightDiagramInput(leftInput)
    }

    return (
        <form className={'form'} onSubmit={handleSubmit}>
            <div id={"relations-input"}>
                <div>
                    <input type="text" value={leftDiagramInput} ref={leftInputRef} onChange={handleLeftDiagramInputChange} />
                    <OperatorButtons input={leftDiagramInput} setInput={setLeftDiagramInput} inputRef={leftInputRef}/>
                </div>
                <div className={"subset-n-invert"}>
                    <img id={'subset-eq'} src='images/subseteq.png' alt="Subset equals"/>
                    <button type='button' className={'invert'} onClick={invertInput}>
                        <img id={'invert-img'} src='images/invert.png' alt="Invert button"/>
                    </button>
                </div>
                <div className={"right-input"}>
                    <input type="text" value={rightDiagramInput} ref={rightInputRef} onChange={handleRightDiagramInputChange} />
                    <OperatorButtons input={rightDiagramInput} setInput={setRightDiagramInput} inputRef={rightInputRef}/>
                </div>
            </div>
            <input className={'submit-button'} type="submit" value="Submit" />
        </form>
    );
}