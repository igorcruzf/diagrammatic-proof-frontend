import React, {useState} from "react";
import {calculateDiagrammaticProof} from "../../services/DiagrammaticProofService";
import "./RelationsInputForm.css"
import {LinearProgress} from "@mui/material";
import RelationsInput from "../RelationsInput/RelationsInput";

export const composition = "ο"
export const intersection = "∩"
export const inverse = "⁻¹"

export function transformInputToSymbol(input: string){
    return input
        .replaceAll("comp", composition)
        .replaceAll("int", intersection)
        .replaceAll("inv", inverse)
}

export interface Inputs {
    leftInput: string,
    rightInput: string
}

export default function RelationsInputForm(props: {
    setDiagrammaticProof: Function,
    resetSlidesValue: Function
}) {

    const [diagramInputs, setDiagramInputs] = React.useState<Inputs>({
        leftInput:`R ${composition} (S${intersection}T)`,
        rightInput: `(R ${composition} S) ${intersection} (R ${composition} T)`
    });

    const [isLoading, setIsLoading] = useState<boolean>(false)

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const leftInput = transformInput(diagramInputs.leftInput)
        const rightInput = transformInput(diagramInputs.rightInput)
        setIsLoading(true)
        calculateDiagrammaticProof(leftInput + "inc" + rightInput).then(
            diagrammaticProofResponse => {
                setIsLoading(false)
                props.resetSlidesValue()
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
            <RelationsInput
                inputs={diagramInputs}
                setInputs={setDiagramInputs}
            />
            <input className={'submit-button'} type="submit" value="Submit" />
            <div className={'linear-progress'}>
                {isLoading && <LinearProgress color="secondary" />}
            </div>
        </form>
    );
}