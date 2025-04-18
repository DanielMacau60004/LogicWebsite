import {BoardComponent} from "../../../types/proofBoard";
import {ProofComponent} from "../ProofComponent";
import React from "react";

export function RuleComponent(rule: BoardComponent) {
    return (
        <ProofComponent {...rule} className={`proof-component proof-rule  ${rule.className || ''}`}>
            {rule.value}
        </ProofComponent>
    )
}