import {
    DiagrammaticProofServiceResponse,
    Pair,
    RelationsDict,
    UniverseDict
} from "../../services/DiagrammaticProofInterfaces";
import {transformInputToSymbol} from "../RelationsInputForm/RelationsInputForm";
import './Countermodel.css'

export default function Countermodel(props: {
    diagrammaticProof: DiagrammaticProofServiceResponse
}){

    let lastLeftRelation: string[] = ["", ""]
    let lastRightRelation: string[] = ["", ""]

    function getRelations(relations: RelationsDict){
        const relationsDivs = []
        for(let label in relations) {
            relationsDivs.push(<div key={label}>
                {`V${transformInputToSymbol(label)} = {${getPairs(relations[label])}}\n`}
            </div>)
        }
        return relationsDivs
    }

    function getRelationsInSide(relations: RelationsDict, direction: string){
        const relationsDivs = []
        for(let label in relations) {
            if(!(label in props.diagrammaticProof.countermodel.relations)){
                if(direction === "LEFT"){
                    lastLeftRelation = ([`${transformInputToSymbol(label)}`, `{${getPairs(relations[label])}}`])
                } else {
                    lastRightRelation = ([`${transformInputToSymbol(label)}`, `{${getPairs(relations[label])}}`])
                }
                relationsDivs.push(<div key={label}>
                    {`${transformInputToSymbol(label)} = {${getPairs(relations[label])}}\n`}
                </div>)
            }
        }
        return relationsDivs
    }

    function getPairs(pairs: Pair[]){
        let pairsStr = ""
        for(let index = 0; index < pairs.length; index++){
            if(pairs[index].first === -1){
                pairsStr += "∅, "
            } else {
                pairsStr += `(${pairs[index].first}, ${pairs[index].second}), `
            }
        }
        return pairsStr.slice(0, -2)
    }

    function getVariables(universe: UniverseDict){
        const variables = Object.values(universe)
        let variablesStr = ""
        variables.forEach(value =>
            variablesStr += value + ", "
        )
        return variablesStr.slice(0, -2)
    }

    return <div id={'countermodel-container'}>
        <div id={'sub-container'}>
            <div id={"initial-countermodel"}>
                <div> Countermodel </div>
                <div> M = (U, V) </div>
                <div>
                    {"U = {" + getVariables(props.diagrammaticProof.countermodel.universe) + "}"}
                </div>
                <div>
                    {getRelations(props.diagrammaticProof.countermodel.relations)}
                </div>
            </div>
            <div className={'model-in-side'}>
                <div>
                    Applying model M on left:
                </div>
                <div>
                    {getRelationsInSide(
                        props.diagrammaticProof.left_diagrammatic_proof.diagrams[0].countermodel_relations,
                        "LEFT"
                    )}
                </div>
            </div>

            <div className={'model-in-side'}>
                <div>
                    Applying model M on right:
                </div>
                <div>
                    {getRelationsInSide(
                        props.diagrammaticProof.right_diagrammatic_proof.diagrams[0].countermodel_relations
                        ,"RIGHT"
                    )}
                </div>
            </div>

            <div id={'conclusion'}>
                <div>
                    {`In this model, we have ${lastLeftRelation[0]} = ${lastLeftRelation[1]} and ${lastRightRelation[0]} = ${lastRightRelation[1]}.`}
                </div>
                <div>
                    {`Hence, ${lastLeftRelation[0]} ⊄ ${lastRightRelation[0]}.}`}
                </div>
            </div>
        </div>
    </div>
}