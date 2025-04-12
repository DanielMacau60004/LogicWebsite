import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {canDropComponent, Component, EProof, Position, resetComponent} from "../utils/components";
import {deepCopy} from "../utils/general";
import {components, getNextID, loadComponents} from "../utils/board";

export interface BoardState {
    active: Component | undefined;
    drag: Component | undefined;
    boardItems: { [key: number]: number };
    components: { [key: number]: Component };
    undoStack: Omit<BoardState, 'undoStack' | 'redoStack'>[];
    redoStack: Omit<BoardState, 'undoStack' | 'redoStack'>[];
}

function getInitialState(): BoardState  {
    const {boardItems, components} = loadComponents();

    return {
        active: undefined,
        drag: undefined,
        boardItems: boardItems,
        components: components,
        undoStack: [],
        redoStack: []
    }
};

const MOVEMENT_THRESHOLD = 10;
const MAX_HISTORY_DEPTH = 20;

function cloneState(state: BoardState): Omit<BoardState, 'undoStack' | 'redoStack'> {
    return {
        active: state.active ? deepCopy(state.active) : undefined,
        drag: state.drag ? deepCopy(state.drag) : undefined,
        boardItems: deepCopy(state.boardItems),
        components: deepCopy(state.components)
    };
}

function saveStateForUndo(state: BoardState) {
    state.undoStack.push(cloneState(state));

    if (state.undoStack.length > MAX_HISTORY_DEPTH) state.undoStack.shift();
    state.redoStack = [];
}

//Assign a new parent id to the tree elements
function attachTreeElements(tree: Component, parentId: number, components: { [key: number]: Component }) {
    const idsToUpdate = [
        tree.conclusion,
        ...(tree.rule != null ? [tree.rule] : []),
        ...(tree.hypotheses?.length ? tree.hypotheses : []),
        ...(tree.marks?.length ? tree.marks : []),
    ];
    idsToUpdate.forEach((id) => {
        components[id] = {...components[id], parent: parentId,};
    });
}

//Swap two elements in the tree
function dragInComponents(state: BoardState, dragging: Component, dropping: Component) {
//TODO CLONE

    const copyDragging = deepCopy(dragging);
    copyDragging.id = dropping.id;
    copyDragging.parent = dropping.parent;
    copyDragging.position = undefined;

    const copyDropping = deepCopy(dropping);
    copyDropping.id = dragging.id;
    copyDropping.parent = dragging.parent;
    copyDropping.position = undefined;

    state.components[dragging.id] = copyDropping;
    state.components[dropping.id] = copyDragging;

    if (dragging.parent === undefined)
        delete state.boardItems[dragging.id];

    if (dragging.type === EProof.TREE)
        attachTreeElements(dragging, dropping.id, state.components);

}

//Drop an element out of other
function dragOutComponent(state: BoardState, position: Position, dragging: Component) {
    let element = dragging;

    if(dragging.clone) { //TODO
        console.log("clone")

        //element = cloneComponent(dragging)
        state.components[element.id] = element
        state.boardItems[element.id] = element.id
        element.position = computeRelativeCoordinates(dragging.id)
    }

    if (dragging.parent !== undefined) {
        const newID = getNextID();

        element = deepCopy(dragging);
        element.id = newID;
        element.parent = undefined;

        state.components[newID] = element;
        state.boardItems[newID] = newID;

        if (dragging.type === EProof.TREE)
            attachTreeElements(element, newID, state.components);

        state.components[dragging.id] = resetComponent(dragging);
        element.position = computeRelativeCoordinates(dragging.id)
        console.log("parent!")
    }

    if (element.position) {
        element.position.x += position.x;
        element.position.y += position.y;
    } else {
        element.position = {...position};
    }

    state.active = element
}

export function boardTranslation() {
    const board = document.getElementById("board");

    if (board) {
        const boardRect = board.getBoundingClientRect();
        return {x: -boardRect.x, y: -boardRect.y};
    }
    return {x: 0, y: 0};
}

function computeRelativeCoordinates(id: number): Position {
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

const slice = createSlice({
    name: 'board',
    initialState: getInitialState(),
    reducers: {
        selectItem: (state, action: PayloadAction<Component | undefined>) => {
            state.active = action.payload;
        },
        selectDrag: (state, action: PayloadAction<Component | undefined>) => {
            state.drag = action.payload;
        },
        deleteItem: (state) => {
            const active = state.active;
            if (active) {
                saveStateForUndo(state);

                if (active.parent) {
                    state.components[active.id] = resetComponent(active)
                } else {
                    delete state.boardItems[active.id];
                    delete state.components[active.id];
                }

                state.active = undefined;
            }
        },
        dragItem: (state, action: PayloadAction<{over?: number, position: Position }>) => {
            const {over, position} = action.payload;
            const active = state.active;

            if (Math.abs(position.x) + Math.abs(position.y) < MOVEMENT_THRESHOLD)
                return

            if (active) {

                let dragging = state.components[Number(active.id)];
                let dropping = state.components[Number(over)];

                if (canDropComponent(state.components, dragging, dropping)) {
                    saveStateForUndo(state);
                    dragInComponents(state, dragging, dropping)
                } else {
                    saveStateForUndo(state);
                    dragOutComponent(state, position, dragging)
                }
            }

        },
        undo: (state) => {
            if (state.undoStack.length === 0) return;

            const prevState = state.undoStack.pop();
            if (prevState) {
                state.redoStack.push(cloneState(state));
                Object.assign(state, prevState);
            }
        },
        redo: (state) => {
            if (state.redoStack.length === 0) return;

            const nextState = state.redoStack.pop();
            if (nextState) {
                state.undoStack.push(cloneState(state));
                Object.assign(state, nextState);
            }
        }
    }
});

export const {selectItem, selectDrag, deleteItem, dragItem, undo, redo} = slice.actions;
export const boardReducer = slice.reducer;

