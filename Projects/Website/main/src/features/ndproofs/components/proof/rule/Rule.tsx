import React from "react";
import {PreviewRuleComponent, RuleComponent} from "../../../types/proofBoard";
import {useRule} from "./useRule";
import "./Rule.scss"

export function Rule({rule}: { rule: RuleComponent }) {
    const {id, ref, value, className, onBlur} = useRule({rule})
    return (
        <div id={id} ref={ref} onBlur={onBlur} tabIndex={0}
             className={`proof-component proof-rule ${className}`}>
            <div className={"proof-component-content"}>
                {value}
            </div>
        </div>
    )
}

export function RulePreview({rule}: { rule: PreviewRuleComponent }) {

    return (
        <div className={`proof-component proof-rule `}>
            <div className={"proof-component-content"}>
                <div dangerouslySetInnerHTML={{ __html: rule.value ?? "" }} />
            </div>
        </div>
    )
}