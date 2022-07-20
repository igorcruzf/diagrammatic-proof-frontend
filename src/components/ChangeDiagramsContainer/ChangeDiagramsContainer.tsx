import {Slider} from "@mui/material";
import './ChangeDiagramsContainer.css'
import {DiagrammaticProofState} from "../Container/Container";

export default function ChangeDiagramsContainer(props: {
    handleDiagramsChange: Function
    diagrammaticProofStates: DiagrammaticProofState[]
    leftMaxIndex: number
    rightMaxIndex: number
    slideValue: number
    setSlideValue: Function
    leftSlideValue: number
    setLeftSlideValue: Function
    rightSlideValue: number
    setRightSlideValue: Function
}){
    const maxSlideValue = props.leftMaxIndex > props.rightMaxIndex? props.leftMaxIndex : props.rightMaxIndex

    function changeDiagrams(currentIndex: number, direction: string){
        if(direction === "LEFT" && currentIndex === props.leftMaxIndex){
            currentIndex = maxSlideValue
        } else if(direction === "RIGHT" && currentIndex === props.rightMaxIndex){
            currentIndex = maxSlideValue
        }
        props.handleDiagramsChange(props.diagrammaticProofStates[currentIndex], direction)
    }

    function setUnarySlidesValue(value: number){
        if(value <= props.leftMaxIndex){
            props.setLeftSlideValue(value)
        } else {
            props.setLeftSlideValue(props.leftMaxIndex)
        }
        if(value <= props.rightMaxIndex){
            props.setRightSlideValue(value)
        } else {
            props.setRightSlideValue(props.rightMaxIndex)
        }
    }

    return <div id={"change-container"}>
        <div id={'unary-slider-container'}>
            <div className={'unary-slider'}>
                <Slider
                    aria-label="Diagram-slider-left"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    value={props.leftSlideValue}
                    step={1}
                    marks
                    min={0}
                    max={props.leftMaxIndex}
                    color="secondary"
                    onChange={ (event, value) => {
                        // @ts-ignore
                        changeDiagrams(value, "LEFT")
                        props.setLeftSlideValue(value)
                    }
                    }
                />
            </div>
            <div className={'unary-slider'}>
                <Slider
                    aria-label="Diagram-slider-right"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    value={props.rightSlideValue}
                    step={1}
                    marks
                    min={0}
                    max={props.rightMaxIndex}
                    color="secondary"
                    onChange={ (event, value) => {
                        // @ts-ignore
                        changeDiagrams(value, "RIGHT")
                        props.setRightSlideValue(value)
                    }
                    }
                />
            </div>
        </div>
        <div id={'slider'}>
            <Slider
                aria-label="Diagram-slider"
                defaultValue={0}
                valueLabelDisplay="auto"
                value={props.slideValue}
                step={1}
                marks
                min={0}
                max={maxSlideValue}
                color="secondary"
                onChange={ (event, value) => {
                        // @ts-ignore
                        changeDiagrams(value, "BOTH")
                        props.setSlideValue(value)
                        // @ts-ignore
                        setUnarySlidesValue(value)
                    }
                }
            />
        </div>
    </div>
}