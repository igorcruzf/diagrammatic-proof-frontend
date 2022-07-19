import {DiagrammaticProofServiceResponse} from "./DiagrammaticProofInterfaces";

export function calculateDiagrammaticProof(expression: string): Promise<DiagrammaticProofServiceResponse> {
    return fetch(`https://diagrammatic-proof-service.herokuapp.com/diagrams/validate-homomorphism?expression=${expression}`, {
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