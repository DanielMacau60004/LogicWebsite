import {RULE} from "./proofRules";

export interface ProofTree {
    conclusion: string,
    marks?: { [key: number]: string },
    rule?: RULE,
    hypotheses?: ProofTree[]
}

