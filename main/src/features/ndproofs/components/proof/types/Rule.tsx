import React from "react";
import {RuleComponent} from "../../../types/proofBoard";

export function Rule({ rule }: { rule: RuleComponent }) {
    return (
        <div id={String(rule.id)} className={`proof-component proof-rule`}>
            {rule.value}
        </div>
    )
}