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

export default function RelationsInputForm(props: {
    setDiagrammaticProof: Function,
    resetSlidesValue: Function
}) {
    const [leftDiagramInput, setLeftDiagramInput] = useState<string>(`R ${composition} (S${intersection}T)`);
    const [rightDiagramInput, setRightDiagramInput] = useState<string>(`(R ${composition} S) ${intersection} (R ${composition} T)`);
    const [isLoading, setIsLoading] = useState<boolean>(false)



    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const leftInput = transformInput(leftDiagramInput)
        const rightInput = transformInput(rightDiagramInput)
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
                leftDiagramInput={leftDiagramInput}
                setLeftDiagramInput={setLeftDiagramInput}
                rightDiagramInput={rightDiagramInput}
                setRightDiagramInput={setRightDiagramInput}
            />
            <input className={'submit-button'} type="submit" value="Submit" />
            <div className={'linear-progress'}>
                {isLoading && <LinearProgress color="secondary" />}
            </div>
        </form>
    );
}