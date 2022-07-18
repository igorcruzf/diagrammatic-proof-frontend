import {Slider} from "@mui/material";
import './ChangeDiagramsContainer.css'
import {DiagrammaticProofState} from "../Container/Container";

export default function ChangeDiagramsContainer(props: {
    handleDiagramsChange: Function
    diagrammaticProofStates: DiagrammaticProofState[],
    maxIndex: number,

}){

    function changeDiagrams(currentIndex: number){
        props.handleDiagramsChange(props.diagrammaticProofStates[currentIndex])
    }

    return <div id={"change-container"}>
        <div id={'slider'}>
            <Slider
                aria-label="Diagram-slider"
                defaultValue={0}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={props.maxIndex}
                color="secondary"
                onChangeCommitted={
                (event, value) => {
                    // @ts-ignore
                    changeDiagrams(value)
                }}
            />
        </div>
    </div>
}