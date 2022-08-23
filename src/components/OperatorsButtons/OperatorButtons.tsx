import {composition, Inputs, intersection, inverse} from "../RelationsInputForm/RelationsInputForm";
import './OperatorButtons.css'
import {RefObject} from "react";

export default function OperatorButtons(props: {
    inputs: Inputs,
    setInputs: Function,
    inputRef: RefObject<HTMLInputElement>,
    direction: string

}){

    async function onClickHandler(operation: string) {
        let value = props.inputRef.current?.selectionStart

        let oldInput = props.direction === "LEFT"? props.inputs.leftInput : props.inputs.rightInput

        let input = ""
        if (value !== null) {
            input = oldInput.slice(0, value) + operation + oldInput.slice(value)
        } else {
            value = oldInput.length
            input = oldInput + operation
        }
        if(props.direction === "LEFT") {
            props.setInputs({
                leftInput: input,
                rightInput: props.inputs.rightInput
            })
        } else {
            props.setInputs({
                rightInput: input,
                leftInput: props.inputs.leftInput
            })
        }
        await props.inputRef.current?.focus()
        props.inputRef.current?.setSelectionRange(value!+operation.length, value!+operation.length)
    }

    return <div id={'operator-buttons'}>
        <button type='button' className={'operator'} onClick={() => onClickHandler("(")}>{"("}</button>
        <button type='button' className={'operator'} onClick={() => onClickHandler(")")}>{")"}</button>
        <button type='button' className={'operator'} onClick={() => onClickHandler(inverse)}>{inverse}</button>
        <button type='button' className={'operator'} onClick={() => onClickHandler(intersection)}>{intersection}</button>
        <button type='button' className={'operator'} onClick={() => onClickHandler(composition)}>{composition}</button>
    </div>
}