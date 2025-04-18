import {BoardPreviewComponent, EProofType, Position} from "../types/proofBoard";

export function mark(value?: string, position?: Position): BoardPreviewComponent {
    return {type: EProofType.MARK, value, position, isDraggable: !!value, isDroppable:true, isMovable: true };
}

export function rule(value?: string, position?: Position): BoardPreviewComponent {
    return {type: EProofType.RULE, value, position, isDraggable: !!value, isDroppable:true, isMovable: true};
}

export function exp(value?: string, position?: Position): BoardPreviewComponent {
    return {type: EProofType.EXP, value, position, isDraggable: !!value, isDroppable:true, isMovable: true};
}

export function tree(conclusion: BoardPreviewComponent, rule: BoardPreviewComponent, hypotheses: BoardPreviewComponent[],
                     marks?: BoardPreviewComponent[], position?: Position): BoardPreviewComponent {
    return {type: EProofType.TREE, conclusion, rule, hypotheses, marks, position, isDraggable: true, isDroppable: false,
        isMovable: true};
}