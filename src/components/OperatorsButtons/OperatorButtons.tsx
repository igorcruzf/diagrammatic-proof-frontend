import {composition, intersection, inverse} from "../RelationsInputForm/RelationsInputForm";
import './OperatorButtons.css'

export default function OperatorButtons(props: {
    input: string,
    setInput: Function
}){

    function onClickHandler(operation: string){
        props.setInput(props.input+operation)
    }

    return <div id={'operator-buttons'}>
        <button type='button' className={'operator'} onClick={() => onClickHandler(intersection)}>{intersection}</button>
        <button type='button' className={'operator'} onClick={() => onClickHandler(composition)}>{composition}</button>
        <button type='button' className={'operator'} onClick={() => onClickHandler(inverse)}>{inverse}</button>
    </div>
}