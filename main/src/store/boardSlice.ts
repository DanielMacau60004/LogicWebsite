import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {deepCopy} from "../utils/general";
import {Board, BoardComponent, EProofType, Position} from "../features/ndproofs/types/proofBoard";
import {computeRelativeCoordinates, proofBoard} from "../features/ndproofs/models/proofBoard";
import {canDropComponent, resetComponent} from "../features/ndproofs/models/proofBoardComponents";

const MOVEMENT_THRESHOLD = 10;
const MAX_HISTORY_DEPTH = 20;

export function cloneState(state: Board): Omit<Board, 'redoStack' | 'undoStack'> {
    return {
        currentId: state.currentId,
        active: state.active ? deepCopy(state.active) : undefined,
        drag: state.drag ? deepCopy(state.drag) : undefined,
        isEditable: state.isEditable,
        doubleClicked: state.doubleClicked ? deepCopy(state.doubleClicked) : undefined,
        boardItems: deepCopy(state.boardItems),
        components: deepCopy(state.components)
    };
}

function saveStateForUndo(state: Board) {
    state.undoStack.push(cloneState(state));

    if (state.undoStack.length > MAX_HISTORY_DEPTH) state.undoStack.shift();
    state.redoStack = [];
}

//Assign a new parent id to the tree elements
function attachTreeElements(state: Board, tree: BoardComponent, parentId: number) {
    const idsToUpdate = [
        tree.conclusion,
        ...(tree.rule != null ? [tree.rule] : []),
        ...(tree.hypotheses?.length ? tree.hypotheses : []),
        ...(tree.marks?.length ? tree.marks : []),
    ];
    idsToUpdate.forEach((id) => {
        state.components[id] = {...state.components[id], parent: parentId,};
    });
}

//Swap two elements in the tree
function dragInsideComponents(state: Board, dragging: BoardComponent, dropping: BoardComponent) {

    //TODO CLONE
    const copyDragging = {...dragging};
    copyDragging.id = dropping.id;
    copyDragging.parent = dropping.parent;
    copyDragging.position = undefined;

    const copyDropping = {...dropping};
    copyDropping.id = dragging.id;
    copyDropping.parent = dragging.parent;
    copyDropping.position = undefined;

    state.components[dragging.id] = copyDropping;
    state.components[dropping.id] = copyDragging;

    if (dragging.parent === undefined)
        delete state.boardItems[dragging.id];

    if (dragging.type === EProofType.TREE)
        attachTreeElements(state, dragging, dropping.id);
}

//Drop an element out of other
function dragOutsideComponent(state: Board, position: Position, dragging: BoardComponent) {
    let element = dragging;

    /*if (dragging.clone) { //TODO
        console.log("clone")

        //element = cloneComponent(dragging)
        state.components[element.id] = element
        state.boardItems[element.id] = element.id
        element.position = computeRelativeCoordinates(dragging.id)
    }*/

    if (dragging.parent !== undefined) {
        const newID = state.currentId++;

        element = deepCopy(dragging);
        element.id = newID;
        element.parent = undefined;

        state.components[newID] = element;
        state.boardItems[newID] = newID;

        if (dragging.type === EProofType.TREE)
            attachTreeElements(state, element, newID);

        state.components[dragging.id] = resetComponent(dragging);
        element.position = computeRelativeCoordinates(dragging.id)
    }

    if (element.position) {
        element.position.x += position.x;
        element.position.y += position.y;
    } else
        element.position = {...position};


    state.active = element
}

const slice = createSlice({
    name: 'board',
    initialState: proofBoard(),
    reducers: {
        selectComponent: (state, action: PayloadAction<BoardComponent | undefined>) => {
            state.active = action.payload;
        },
        selectDraggingComponent: (state, action: PayloadAction<BoardComponent | undefined>) => {
            state.drag = action.payload;
        },
        selectDoubleClickedComponent: (state, action: PayloadAction<BoardComponent | undefined>) => {
            state.doubleClicked = action.payload;
        },
        setEditable: (state, action: PayloadAction<boolean>) => {
          state.isEditable = action.payload
        },
        updateComponent: (state, action: PayloadAction<BoardComponent>) => {
            const component = action.payload
            state.components[component.id] = component
        },
        deleteComponent: (state) => {
            if(!state.isEditable) return

            const active = state.active;
            if (state.isEditable && active) {
                saveStateForUndo(state);

                if (active.parent) {
                    state.components[active.id] = resetComponent(active)
                } else {
                    delete state.boardItems[active.id];
                    delete state.components[active.id];
                }

                state.doubleClicked = undefined;
                state.active = undefined;
            }
        },
        dragComponent: (state, action: PayloadAction<{over?: number, position: Position }>) => {
            if(!state.isEditable) return

            const {over, position} = action.payload;
            const active = state.active;

            if (Math.abs(position.x) + Math.abs(position.y) < MOVEMENT_THRESHOLD)
                return

            if (state.isEditable && active) {

                let dragging = state.components[Number(active.id)];
                let dropping = state.components[Number(over)];

                if (canDropComponent(state, dragging, dropping)) {
                    saveStateForUndo(state);
                    dragInsideComponents(state, dragging, dropping)
                } else {
                    saveStateForUndo(state);
                    dragOutsideComponent(state, position, dragging)
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

export const {
    selectComponent,
    selectDraggingComponent,
    selectDoubleClickedComponent,
    setEditable,
    updateComponent,
    deleteComponent,
    dragComponent,
    undo,
    redo
} = slice.actions;

export const boardReducer = slice.reducer;
