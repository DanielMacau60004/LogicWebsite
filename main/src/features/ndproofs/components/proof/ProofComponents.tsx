import React from 'react';
import {ProofComponent} from "./ProofComponent";
import {GlobalState} from "../../../../store";
import {useSelector} from "react-redux";
import {BoardComponent, EProofType} from "../../types/proofBoard";
import {ExpComponent} from "./ExpComponent";
import {TreeComponent} from "./TreeComponent";

export function RuleComponent(rule: BoardComponent) {
    return (
        <ProofComponent {...rule} className={`proof-component proof-rule  ${rule.className || ''}`}>
            {rule.value}
        </ProofComponent>
    )
}

export function MarkComponent(mark: BoardComponent) {
    return (
        <ProofComponent {...mark} className={`proof-component proof-mark ${mark.className || ''}`}>
            {mark.value}
        </ProofComponent>
    )
}

export function Element(component: BoardComponent) {
    const {isEditable} = useSelector((state: GlobalState) => state.board)
    const isDraggable = component.isDraggable && isEditable

    switch (component.type) {
        case EProofType.EXP :
            return <ExpComponent {...component} isDraggable={isDraggable}/>
        case EProofType.MARK :
            return <MarkComponent {...component} isDraggable={isDraggable}/>
        case EProofType.RULE :
            return <RuleComponent {...component} isDraggable={isDraggable}/>
        case EProofType.TREE :
            return <TreeComponent {...component} isDraggable={isDraggable}/>
    }
}
