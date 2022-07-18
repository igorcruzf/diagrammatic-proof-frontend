export interface DiagrammaticProofServiceResponse {
    left_diagrammatic_proof: DiagrammaticProof,
    right_diagrammatic_proof: DiagrammaticProof,
    homomorphic: boolean
}

export interface DiagrammaticProof {
    diagrams: Diagram[]
}

export interface Diagram {
    step_description: string,
    nodes: DiagramNode[],
    edges: DiagramEdge[],
    removed_edge?: DiagramEdge,
    created_edges?: DiagramEdge[]
}

interface DiagramNode {
    name: string,
    type: string,
    image_name?: string
}

export interface DiagramEdge {
    left_node: DiagramNode,
    right_node: DiagramNode,
    label: Term | AtomicTerm,
    id: string
}

export interface Term {
    left_term: Term | AtomicTerm,
    right_term: Term | AtomicTerm | undefined,
    operation: string
}

export interface AtomicTerm {
    name: string
}
