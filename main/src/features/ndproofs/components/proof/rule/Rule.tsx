import React from "react";
import {RuleComponent} from "../../../types/proofBoard";
import {useRule} from "./useRule";
import "./Rule.scss"

export function Rule({rule}: { rule: RuleComponent }) {
    const {id, ref, value, onBlur} = useRule({rule})
    return (
        <div id={id} ref={ref} onBlur={onBlur} tabIndex={0}
             className={`proof-component proof-rule`}>
            <div className={"proof-component-content"}>
                {value}
            </div>
        </div>
    )
}