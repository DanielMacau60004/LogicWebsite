import React from "react";
import {RuleComponent} from "../../../types/proofBoard";
import {useRule} from "../useRule";

export function Rule({rule}: { rule: RuleComponent }) {
    const {id, ref, onBlur} = useRule({rule})
    return (
        <div id={id} ref={ref} onBlur={onBlur} tabIndex={0}
             className={`proof-component proof-rule`}>
            <div className={"proof-component-content"}>
                {rule.value}
            </div>
        </div>
    )
}