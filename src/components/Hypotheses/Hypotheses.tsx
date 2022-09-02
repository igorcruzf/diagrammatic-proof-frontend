import React from "react";
import CheckboxList from "./CheckboxList";
import "./Hypotheses.css";
import {IconButton} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Inputs} from "../RelationsInputForm/RelationsInputForm";

export interface InputsIndexed {
    inputs: Inputs,
    index: number
}

export default function Hypotheses(
    props: {
        inputsList: InputsIndexed[]
        setInputsList: Function
        unchecked: number[]
        setUnchecked: Function
    }
) {
    function changeInputsList(inputs: Inputs, index: number) {
        const newInputs: InputsIndexed = {inputs: inputs, index: index}
        const newInputList = props.inputsList.map( value => value.index === index? newInputs : value)
        props.setInputsList(newInputList)
    }

    function deleteFromList(index: number) {
        const newInputList = props.inputsList.filter( value => value.index !== index)
        props.setInputsList(newInputList)
    }

    function addHypothesis() {
        let index = -1
        if(props.inputsList.length > 0) {
            index = props.inputsList[props.inputsList.length - 1].index
        }
        const newInputs = [...props.inputsList, {inputs: {leftInput: "", rightInput: ""}, index: index+1}]
        props.setInputsList(newInputs)
    }

    return <div id={"hypotheses-list"}>
        <div className={"list"}>
            <CheckboxList
                inputsList={props.inputsList}
                changeInputsList={changeInputsList}
                deleteFromList={deleteFromList}
                unchecked={props.unchecked}
                setUnchecked={props.setUnchecked}
            />
        </div>
        <IconButton aria-label="add"
                    onClick={addHypothesis}>
            <AddCircleIcon/>
        </IconButton>
    </div>
}
