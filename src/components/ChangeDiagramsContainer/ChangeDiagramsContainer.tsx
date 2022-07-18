import {Slider} from "@mui/material";
import './ChangeDiagramsContainer.css'
import {DiagrammaticProofState} from "../Container/Container";

export default function ChangeDiagramsContainer(props: {
    handleDiagramsChange: Function
    diagrammaticProofStates: DiagrammaticProofState[],
    maxIndex: number,
    slideValue: number
    setSlideValue: Function
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
                value={props.slideValue}
                step={1}
                marks
                min={0}
                max={props.maxIndex}
                color="secondary"
                onChange={ (event, value) => {
                        // @ts-ignore
                        changeDiagrams(value)
                        props.setSlideValue(value)
                    }
                }
            />
        </div>
    </div>
}