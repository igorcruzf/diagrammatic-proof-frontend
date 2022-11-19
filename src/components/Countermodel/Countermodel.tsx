import {
    AtomicTerm,
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
                {`${transformInputToSymbol(label)} is ${getPairs(relations[label])}\n`}
            </div>)
        }
        return relationsDivs
    }

    function isADiagramWithoutTransformation(label: string, relations: RelationsDict, direction: string){
        return Object.values(relations).length === Object.values(props.diagrammaticProof.countermodel.relations).length &&
            ((rightDiagramEdgeName() === label && direction === "RIGHT") ||
            ((leftDiagramEdgeName() === label && direction === "LEFT")))
    }

    function rightDiagramEdgeName(){
        return (props.diagrammaticProof.right_diagrammatic_proof.diagrams.at(-1)!.edges[0].label as AtomicTerm).name
    }

    function leftDiagramEdgeName(){
        return (props.diagrammaticProof.left_diagrammatic_proof.diagrams.at(-1)!.edges[0].label as AtomicTerm).name
    }

    function getRelationsInSide(relations: RelationsDict, direction: string){
        const relationsDivs = []
        for(let label in relations) {
            if(!(label in props.diagrammaticProof.countermodel.relations) || isADiagramWithoutTransformation(label, relations, direction)){
                if(direction === "LEFT"){
                    lastLeftRelation = ([`${transformInputToSymbol(label)}`, `${getPairs(relations[label])}`])
                } else {
                    console.log(relations)
                    lastRightRelation = ([`${transformInputToSymbol(label)}`, `${getPairs(relations[label])}`])
                }
                relationsDivs.push(<div key={label}>
                    {`${transformInputToSymbol(label)} is ${getPairs(relations[label])}\n`}
                </div>)
            }
        }
        return relationsDivs
    }

    function getPairs(pairs: Pair[]){
        if(pairs[0].first === -1){
            return "∅"
        }
        let pairsStr = "{"
        for(let index = 0; index < pairs.length; index++){
            pairsStr += `(${pairs[index].first}, ${pairs[index].second}), `
        }
        return pairsStr.slice(0, -2) + '}'
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
                    Calculating the relation defined by the left hand side term in model M:
                </div>
                <div>
                    {getRelationsInSide(
                        props.diagrammaticProof.left_diagrammatic_proof.diagrams[0].countermodel_relations!,
                        "LEFT"
                    )}
                </div>
            </div>

            <div className={'model-in-side'}>
                <div>
                    Calculating the relation defined by the right hand side term in model M:
                </div>
                <div>
                    {getRelationsInSide(
                        props.diagrammaticProof.right_diagrammatic_proof.diagrams[0].countermodel_relations!,
                        "RIGHT"
                    )}
                </div>
            </div>

            <div id={'conclusion'}>
                <div>
                    {`In model M, we have ${lastLeftRelation[0]} is ${lastLeftRelation[1]} and ${lastRightRelation[0]} is ${lastRightRelation[1]}.`}
                </div>
                <div>
                    {`Hence, the inclusion ${lastLeftRelation[0]} ⊆ ${lastRightRelation[0]} is not true in M.`}
                </div>
            </div>
        </div>
    </div>
}