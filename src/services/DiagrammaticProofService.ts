import {DiagrammaticProofServiceResponse} from "./DiagrammaticProofInterfaces";

export function calculateDiagrammaticProof(expression: string, hypotheses?: string): Promise<DiagrammaticProofServiceResponse> {
    let url = `http://localhost:8080/diagrams/validate-homomorphism?expression=${expression}`
    if(hypotheses != null && hypotheses.length > 0){
        url += `&hypotheses=${hypotheses}`
    }
    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(
        data => {
            if(data.ok){
                return data.json()
            } else {
                alert("Error in one or both inputs, try adding parentheses around each term.")
            }
        }
    )

}