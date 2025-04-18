import {Board, BoardAction, BoardComponent, BoardPreviewComponent, EProofType, Position} from "../types/proofBoard";
import {boardComponents} from "../boardInit";
import {sideBarComponents} from "../sidebarInit";
import {appendSidebarItemList} from "./proofSidebar";

export const BOARD_COMPONENT_ID = "board"
export const DELETE_COMPONENT_ID = "delete"
export const KEYBOARD_COMPONENT_ID = "keyboard"

export const LOGICAL_SYMBOLS: string[] = ['⊥', '⊤', '¬', '∧', '∨', '→', '∀', '∃'];
export const GROUPING_SYMBOLS: string[] = ['(', ')'];
export const GREEK_LETTERS: string[] = ['α', 'β', 'γ', 'δ', 'φ', 'ψ'];

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
        sideBarItems: [], //Move to a different store :d
        components: {},
        boardItems: {},
        redoStack: [],
        undoStack: []
    };

    sideBarComponents().forEach(sidebarItem => {
        const items = appendSidebarItemList(board, sidebarItem)
        board.sideBarItems.push(items)
    })

    boardComponents().forEach(component => {
        const id = appendComponent(board, component);
        board.boardItems[id] = id;
    });

    console.log(board.sideBarItems);
    console.log(board.boardItems);
    console.log(board.components);

    return board;
}

export function appendComponent(state: Board, component: BoardPreviewComponent, parent?: number): number {
    const id = state.currentId++;

    switch (component.type) {
        case EProofType.TREE:
            const conclusion = appendComponent(state, component.conclusion, id)
            const rule = appendComponent(state, component.rule, id)
            const hypotheses = component.hypotheses.map((hypothesis: any) =>
                appendComponent(state, hypothesis, id));
            const marks = component.marks?.map((mark: any) =>
                appendComponent(state, mark, id));

            state.components[id] = {
                id, type: EProofType.TREE, parent, position: component.position, conclusion, rule,
                hypotheses, marks, isDraggable: component.isDraggable, isDroppable: component.isDroppable,
                isMovable: component.isMovable
            }
            break;
        default:
            component.parent = parent
            state.components[id] = {...component, id}
            break;
    }
    return id;
}

export function toCreateComponent(state: Board, id: number): BoardPreviewComponent {
    const component = state.components[id]

    switch (component.type) {
        case EProofType.TREE:
            const conclusion = state.components[component.conclusion]
            const rule = state.components[component.rule]
            const hypotheses = component.hypotheses.map((hypothesis: any) =>
                toCreateComponent(state, hypothesis));
            const marks = component.marks?.map((mark: any) =>
                toCreateComponent(state, mark));

            return { id: component.id,
                type: EProofType.TREE, parent: component.parent, position: component.position, conclusion, rule,
                hypotheses, marks, isDraggable: component.isDraggable, isDroppable: component.isDroppable,
                isMovable: component.isMovable
            }

        default:
            return component
    }

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
