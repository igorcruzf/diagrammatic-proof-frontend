import OperatorButtons from "../OperatorsButtons/OperatorButtons";
import React, {RefObject, useRef} from "react";
import {composition, intersection, inverse} from "../RelationsInputForm/RelationsInputForm";
import "./RelationsInput.css"

export default function RelationsInput(props: {
    leftDiagramInput: string,
    setLeftDiagramInput: Function,
    rightDiagramInput: string,
    setRightDiagramInput: Function
}) {
    const leftInputRef = useRef<HTMLInputElement>(null);
    const rightInputRef = useRef<HTMLInputElement>(null);

    function invertInput(){
        const leftInput = props.leftDiagramInput
        props.setLeftDiagramInput(props.rightDiagramInput)
        props.setRightDiagramInput(leftInput)
    }

    async function handleLeftDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        await handleSetInputValue(event.currentTarget.value, leftInputRef, props.setLeftDiagramInput);
    }

    async function handleRightDiagramInputChange(event: React.FormEvent<HTMLInputElement>) {
        await handleSetInputValue(event.currentTarget.value, rightInputRef, props.setRightDiagramInput);
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

        inputRef.current?.setSelectionRange(value! + operationLength, value! + operationLength)
    }

    return <div id={"relations-input"}>
        <div>
            <input type="text" value={props.leftDiagramInput} ref={leftInputRef} onChange={handleLeftDiagramInputChange} />
            <OperatorButtons input={props.leftDiagramInput} setInput={props.setLeftDiagramInput} inputRef={leftInputRef}/>
        </div>
        <div className={"subset-n-invert"}>
            <img id={'subset-eq'} src='images/subseteq.png' alt="Subset equals"/>
            <button type='button' className={'invert'} onClick={invertInput}>
                <img id={'invert-img'} src='images/invert.png' alt="Invert button"/>
            </button>
        </div>
        <div className={"right-input"}>
            <input type="text" value={props.rightDiagramInput} ref={rightInputRef} onChange={handleRightDiagramInputChange} />
            <OperatorButtons input={props.rightDiagramInput} setInput={props.setRightDiagramInput} inputRef={rightInputRef}/>
        </div>
    </div>
}