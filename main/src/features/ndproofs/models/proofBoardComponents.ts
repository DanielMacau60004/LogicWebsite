import {Board, BoardComponent, EProofType} from "../types/proofBoard";

const dragMap = new Map<EProofType, EProofType>([
    [EProofType.EXP, EProofType.EXP],
    [EProofType.TREE, EProofType.EXP],
    [EProofType.MARK, EProofType.MARK],
    [EProofType.RULE, EProofType.RULE]
]);

//Method responsible to check whether a component is contained in certain parent component
function containsParent(board: Board, component: BoardComponent, parent: number): boolean {
    while (component && component.id !== parent) {
        if (component.parent == null) break;
        component = board.components[component.parent];
    }
    return component?.id === parent
}

//Method responsible to compute possible drags
function containDragType(board: Board, dragging: BoardComponent, dropping: BoardComponent): boolean {
    //Prevent trees from being dragged into the conclusion
    if (dropping.type === EProofType.EXP && dragging.type === EProofType.TREE && dropping.parent) {
        const parent = board.components[dropping.parent]
        return parent.conclusion !== dropping.id
    }

    return dragMap.get(dragging.type) === dropping.type
}

//Check whether a dragging component can be dropped into another
export function canDropComponent(board: Board, dragging?: BoardComponent, dropping?: BoardComponent): boolean {
    return (
        dragging !== undefined && dropping !== undefined &&
        dropping.isDroppable && dragging.isDraggable &&
        dropping.parent !== undefined &&
        dragging.id !== dropping.id &&
        dragging.id !== dropping.parent &&
        containDragType(board, dragging, dropping) &&
        !containsParent(board, dropping, dragging.id)
    );
}

//Method responsible to reset a component to its initial state before being dragged
export function resetComponent(component: BoardComponent): BoardComponent {
    const {id, parent, type} = component;
    return {id, parent, type: dragMap.get(type) || type, isDraggable: false, isDroppable: true, isMovable: true}
}


