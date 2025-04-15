import {BoardCreatorComponent, EProofType, Position} from "../types/proofBoard";

export function mark(value?: string, position?: Position): BoardCreatorComponent {
    return {type: EProofType.MARK, value, position, isDraggable: !!value, isDroppable:true };
}

export function markC(value?: string): BoardCreatorComponent {
    return {type: EProofType.MARK, value, isCloneable: true, isDraggable: !!value, isDroppable: false}
}

export function rule(value?: string, position?: Position): BoardCreatorComponent {
    return {type: EProofType.RULE, value, position, isDraggable: !!value, isDroppable:true};
}

export function ruleC(value?: string): BoardCreatorComponent {
    return {type: EProofType.RULE, value, isCloneable: true, isDraggable: !!value, isDroppable: false}
}

export function exp(value?: string, position?: Position): BoardCreatorComponent {
    return {type: EProofType.EXP, value, position, isDraggable: !!value, isDroppable:true};
}

export function expC(value?: string): BoardCreatorComponent {
    return {type: EProofType.EXP, isCloneable: true, isDraggable: !!value, isDroppable: false}
}

export function tree(conclusion: BoardCreatorComponent, rule: BoardCreatorComponent, hypotheses: BoardCreatorComponent[],
                     marks?: BoardCreatorComponent[], position?: Position): BoardCreatorComponent {
    return {type: EProofType.TREE, conclusion, rule, hypotheses, marks, position, isDraggable: true, isDroppable: false};
}

export function treeC(conclusion: BoardCreatorComponent, rule: BoardCreatorComponent, hypotheses:
    BoardCreatorComponent[], marks?: BoardCreatorComponent[]): BoardCreatorComponent {
    return {
        type: EProofType.TREE, conclusion, rule, hypotheses, marks,
        isCloneable: true, isDraggable: true, isDroppable: false
    }
}