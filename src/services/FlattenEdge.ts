import {AtomicTerm, DiagramEdge, Term} from "./DiagrammaticProofInterfaces";
import {composition, intersection, inverse} from "../components/RelationsInputForm/RelationsInputForm";

function isAtomic(term: Term | AtomicTerm): term is AtomicTerm {
    return 'name' in term;
}

function flattenTerm(term: AtomicTerm | Term){
    if(isAtomic(term)){
        return term.name
    }
    let flatTerm = "";
    if(term.operation === "INVERSE"){
        flatTerm += "("
    }
    flatTerm+=flattenTerm(term.left_term)
    if(term.operation === "INVERSE"){
        flatTerm += ")"
    }
    flatTerm+=transformOperation(term.operation)
    if(term.right_term !== undefined){
        flatTerm+=flattenTerm(term.right_term)
    }
    return flatTerm
}

function transformOperation(operation: string) {
    switch (operation) {
        case "INVERSE":
            return inverse
        case "COMPOSITION":
            return composition
        case "INTERSECTION":
            return intersection
    }
}

export function flattenEdgeLabels(edge: DiagramEdge){
    return flattenTerm(edge.label)
}