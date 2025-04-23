import {
    Board,
    BoardAction, Component,
    ComponentType,
    Position,
    PreviewComponent,
    PreviewMarkComponent, TreeComponent,
    TreePreviewComponent
} from "../types/proofBoard";
import {boardComponents} from "../boardInit";
export const BOARD_COMPONENT_ID = "board"
export const DELETE_COMPONENT_ID = "delete"
export const CLONE_COMPONENT_ID = "clone"
export const EXP_KEYBOARD_COMPONENT_ID = "exp-keyboard"
export const RULE_KEYBOARD_COMPONENT_ID = "rule-keyboard"
export const MARK_KEYBOARD_COMPONENT_ID = "mark-keyboard"

export const LOGICAL_SYMBOLS: string[] = ['⊥', '⊤', '¬', '∧', '∨', '→', '∀', '∃'];
export const GROUPING_SYMBOLS: string[] = ['(', ')'];
export const GREEK_LETTERS: string[] = ['α', 'β', 'γ', 'δ', 'φ', 'ψ'];
export const RULE_SYMBOLS = ["⊥", "∧I", "∧El", "∧Er", "∨Il", "∨E", "∨Ir", "→I", "→E", "¬I", "¬E", "∀I", "∀E", "∃I", "∃E"];
export const MARKS_SYMBOLS = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

export const KeyActionMap: Map<string, BoardAction> = new Map([
    ['Backspace', BoardAction.Delete],
    ['Delete', BoardAction.Delete],
    ['Ctrl+KeyZ', BoardAction.Undo],
    ['Ctrl+KeyY', BoardAction.Redo],
    ['Ctrl+KeyC', BoardAction.Copy],
    ['Ctrl+KeyV', BoardAction.Paste],
]);

export function proofBoard(): Board {
    const board: Board = {
        currentId: 1,
        active: undefined,
        drag: undefined,
        isEditable: true,
        copy: undefined,
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

export function appendComponent(state: Board, component: PreviewComponent, parent?: number): number {
    const id = state.currentId++;

    switch (component.type) {
        case ComponentType.TREE:
            const tree = component as TreePreviewComponent
            const conclusion = appendComponent(state, tree.conclusion, id)
            const rule = appendComponent(state, tree.rule, id)
            const hypotheses = tree.hypotheses.map((hypothesis: PreviewComponent) =>
                appendComponent(state, hypothesis, id))
            const marks = tree.marks?.map((mark: PreviewMarkComponent) =>
                appendComponent(state, mark, id));

            state.components[id] = {
                id, type: ComponentType.TREE, parent, position: tree.position, conclusion, rule, hypotheses, marks
            }

            break;
        default:
            component.parent = parent
            state.components[id] = {...component, id}
            break;
    }

    return id;
}

export function duplicateComponent(state: Board, component: Component, parent?: number): number {
    const id = state.currentId++;

    switch (component.type) {
        case ComponentType.TREE:
            const tree = component as TreeComponent
            const conclusion = duplicateComponent(state, state.components[tree.conclusion], id)
            const rule = duplicateComponent(state, state.components[tree.rule], id)
            const hypotheses = tree.hypotheses.map((hypothesis: number) =>
                duplicateComponent(state, state.components[hypothesis], id))
            const marks = tree.marks?.map((mark: number) =>
                duplicateComponent(state, state.components[mark], id));

            state.components[id] = {
                id, type: ComponentType.TREE, parent, position: tree.position, conclusion, rule, hypotheses, marks
            }

            break;
        default:
            state.components[id] = {...component, id, parent}
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
        const elementRect = htmlElement.getBoundingClientRect();
        return computeBoardCoordinates(elementRect)
    }

    return {x: 0, y: 0};
}

export function computeBoardCoordinates(position: Position): Position {
    const boardRect = boardTranslation();

    const x = position.x + boardRect.x;
    const y = position.y + boardRect.y;

    return {x, y};
}

