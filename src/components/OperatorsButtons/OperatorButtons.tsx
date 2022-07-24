import {composition, intersection, inverse} from "../RelationsInputForm/RelationsInputForm";
import './OperatorButtons.css'
import {RefObject} from "react";

export default function OperatorButtons(props: {
    input: string,
    setInput: Function
    inputRef: RefObject<HTMLInputElement>
}){

    async function onClickHandler(operation: string) {
        let value = props.inputRef.current?.selectionStart
        let input = ""
        if (value !== null) {
            input = props.input.slice(0, value) + operation + props.input.slice(value)
        } else {
            value = props.input.length
            input = props.input + operation
        }
        props.setInput(input)
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