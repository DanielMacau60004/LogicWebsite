import React from 'react';
import {GlobalState} from "../../../../store";
import {useSelector} from "react-redux";
import {BoardComponent, EProofType} from "../../types/proofBoard";
import {ExpComponent} from "./types/ExpComponent";
import {TreeComponent} from "./types/TreeComponent";
import {RuleComponent} from "./types/RuleComponent";
import {MarkComponent} from "./types/MarkComponent";

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