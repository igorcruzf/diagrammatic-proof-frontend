import OperatorButtons from "../OperatorsButtons/OperatorButtons";
import React, {RefObject, useRef} from "react";
import {composition, Inputs, intersection, inverse} from "../RelationsInputForm/RelationsInputForm";
import "./RelationsInput.css"

export default function RelationsInput(props: {
    inputs: Inputs,
    setInputs: Function
}) {
    const leftInputRef = useRef<HTMLInputElement>(null);
    const rightInputRef = useRef<HTMLInputElement>(null);

    function invertInput(){
        props.setInputs({
            leftInput: props.inputs.rightInput,
            rightInput: props.inputs.leftInput
        })
    }

    async function handleLeftDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        await handleSetInputValue(event.currentTarget.value, leftInputRef, "LEFT");
    }

    async function handleRightDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        await handleSetInputValue(event.currentTarget.value, rightInputRef, "RIGHT");
    }

    async function handleSetInputValue(inputValue: string, inputRef: RefObject<HTMLInputElement>, direction: string) {
        let value = inputRef.current?.selectionStart

        let operationLength = 0
        if(inputValue.includes(",")) {
            operationLength = (inputValue.match(/,/g) || []).length
        }
        const newInputValue = inputValue.replaceAll(";", composition)
            .replaceAll(".", intersection)
            .replaceAll(",", inverse)

        if(direction === "LEFT") {
            props.setInputs({
                leftInput: newInputValue,
                rightInput: props.inputs.rightInput
            })
        } else {
            props.setInputs({
                rightInput: newInputValue,
                leftInput: props.inputs.leftInput
            })
        }

        await inputRef.current?.focus()

        inputRef.current?.setSelectionRange(value! + operationLength, value! + operationLength)
    }

    return <div id={"relations-input"}>
        <div>
            <input type="text" value={props.inputs.leftInput} ref={leftInputRef} onChange={handleLeftDiagramInputChange} />
            <OperatorButtons inputs={props.inputs} setInputs={props.setInputs} inputRef={leftInputRef} direction={"LEFT"}/>
        </div>
        <div className={"subset-n-invert"}>
            <img id={'subset-eq'} src='images/subseteq.png' alt="Subset equals"/>
            <button type='button' className={'invert'} onClick={invertInput}>
                <img id={'invert-img'} src='images/invert.png' alt="Invert button"/>
            </button>
        </div>
        <div className={"right-input"}>
            <input type="text" value={props.inputs.rightInput} ref={rightInputRef} onChange={handleRightDiagramInputChange} />
            <OperatorButtons inputs={props.inputs} setInputs={props.setInputs} inputRef={rightInputRef} direction={"RIGHT"}/>
        </div>
    </div>
}