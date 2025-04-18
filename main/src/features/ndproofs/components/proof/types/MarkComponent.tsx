import {BoardComponent} from "../../../types/proofBoard";
import {ProofComponent} from "../ProofComponent";
import React from "react";

export function MarkComponent(mark: BoardComponent) {
    return (
        <ProofComponent {...mark} className={`proof-component proof-mark ${mark.className || ''}`}>
            {mark.value}
        </ProofComponent>
    )
}
