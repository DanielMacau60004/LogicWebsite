import {Board, BoardAction, BoardCreatorComponent, EProofType, Position} from "../types/proofBoard";
import {boardComponents} from "../boardInit";

export const BOARD_COMPONENT_ID = "board"
export const DELETE_COMPONENT_ID = "delete"

export const LOGICAL_SYMBOLS: string[] = ['⊥', '⊤', '¬', '∧', '∨', '→', '∀', '∃'];
export const GROUPING_SYMBOLS: string[] = ['(', ')'];
export const GREEK_LETTERS: string[] = ['α', 'β', 'γ', 'δ', 'φ', 'ψ'];

export const KeyActionMap: Map<string, BoardAction> = new Map([
    ['Backspace', BoardAction.Delete],
    ['Delete', BoardAction.Delete],
    ['Ctrl+KeyZ', BoardAction.Undo],
    ['Ctrl+KeyY', BoardAction.Redo],
]);

export function proofBoard(): Board {
    const board: Board = {
        currentId: 1,
        active: undefined,
        drag: undefined,
        isEditable: true,
        editing: undefined,
        components: {},
        boardItems: {},
        redoStack: [],
        undoStack: []
    };

    boardComponents().forEach(component => {
        const id = appendComponent(board, component);
        board.boardItems[id] = id;
    });

    console.log(board.boardItems);
    console.log(board.components);

    return board;
}

export function appendComponent(state: Board, component: BoardCreatorComponent, parent?: number): number {
    const id = state.currentId++;
    switch (component.type) {
        case EProofType.TREE:
            const conclusion = appendComponent(state, component.conclusion, id)
            const rule = appendComponent(state, component.rule, id)
            const hypotheses = component.hypotheses.map((hypothesis: any) =>
                appendComponent(state, hypothesis, id));
            const marks = component.marks?.map((mark: any) =>
                appendComponent(state, mark, id));

            state.components[id] = {id, type: EProofType.TREE, parent, position: component.position, conclusion, rule,
                hypotheses, marks, isDraggable: component.isDraggable, isDroppable: component.isDroppable}
            break;
        default:
            component.parent = parent
            state.components[id] = {id, ...component}
            break;
    }
    return id;
}

function boardTranslation(): Position {
    const board = document.getElementById(BOARD_COMPONENT_ID);

    if (board) {
        const boardRect = board.getBoundingClientRect();
        return {x: -boardRect.x, y: -boardRect.y};
    }
    return {x: 0, y: 0};
}

export function computeRelativeCoordinates(id: number): Position {
    const htmlElement = document.getElementById(String(id));

    if (htmlElement) {
        const boardRect = boardTranslation();
        const elementRect = htmlElement.getBoundingClientRect();

        const x = elementRect.x + boardRect.x;
        const y = elementRect.y + boardRect.y;

        return {x, y};
    }

    return {x: 0, y: 0};
}
