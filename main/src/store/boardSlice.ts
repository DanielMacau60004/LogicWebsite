import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {deepCopy} from "../utils/general";
import {
    Board,
    Component,
    ComponentType,
    Position,
    RuleComponent,
    TreeComponent,
    PreviewTreeComponent, PreviewMarkComponent
} from "../features/ndproofs/types/proofBoard";
import {Boards, proofBoard,} from "../features/ndproofs/models/proofBoard";
import {Components} from "../features/ndproofs/models/proofComponents";

const MOVEMENT_THRESHOLD = 10;
const MAX_HISTORY_DEPTH = 20;

export function cloneState(state: Board): Omit<Board, 'redoStack' | 'undoStack' | 'sideBarItems'> {
    return {
        currentId: state.currentId,
        active: undefined,
        drag: undefined,
        copy: undefined,
        isEditable: true,
        editing: undefined,
        boardItems: deepCopy(state.boardItems),
        components: deepCopy(state.components)
    };
}

function saveStateForUndo(state: Board) {
    state.undoStack.push(cloneState(state));

    if (state.undoStack.length > MAX_HISTORY_DEPTH) state.undoStack.shift();
    state.redoStack = [];
}

const slice = createSlice({
    name: 'board',
    initialState: proofBoard(),
    reducers: {
        appendTree: (state, action: PayloadAction<PreviewTreeComponent>) => {
            const newID = Boards.appendComponent(state, action.payload);
            const newTree = state.components[newID]

            if (!state.active || !state.active.parent) return
            saveStateForUndo(state);

            const currentParent = state.components[state.active.parent]
            if (!Components.isASimpleTree(currentParent)) {
                const index = currentParent?.hypotheses?.indexOf(state.active.id)
                currentParent.hypotheses[index] = newID
                newTree.parent = currentParent.id

                delete state.components[state.active.id]
            } else {
                state.boardItems[newID] = newID
                newTree.position = currentParent.position

                Boards.deleteEntireComponent(state, currentParent)
                delete state.boardItems[currentParent.id]
            }

            state.active = undefined
        },
        selectComponent: (state, action: PayloadAction<Component | undefined>) => {
            state.active = action.payload;
        },
        selectDraggingComponent: (state, action: PayloadAction<TreeComponent | undefined>) => {
            state.drag = action.payload;
        },
        selectEditingComponent: (state, action: PayloadAction<Component | undefined>) => {
            state.editing = action.payload;
        },
        setEditable: (state, action: PayloadAction<boolean>) => {
            state.isEditable = action.payload
        },
        updateComponent: (state, action: PayloadAction<{ component: Component, saveState: boolean }>) => {
            const {component, saveState} = action.payload

            if (saveState)
                saveStateForUndo(state);

            if (component.type === ComponentType.RULE)
                Boards.updateRule(state, component as RuleComponent)

            state.components[component.id] = component
            state.editing = component
        },
        deleteComponent: (state) => {
            if (!state.isEditable) return

            const active = state.active;
            if (active) {
                saveStateForUndo(state);
                Boards.deleteEntireComponent(state, active)

                if (active.parent) {
                    state.components[active.id] = Components.reset(active)
                } else {
                    delete state.boardItems[active.id];
                    delete state.components[active.id];
                }

                state.editing = undefined;
                state.active = undefined;
            }
        },
        dragComponent: (state, action: PayloadAction<{ over?: number, position: Position }>) => {
            if (!state.isEditable) return

            const {over, position} = action.payload;
            const drag = state.drag;
            const active = state.active;

            //Check if the movement is big enough to trigger the drag event
            if (Math.abs(position.x) + Math.abs(position.y) < MOVEMENT_THRESHOLD)
                return

            //Check if an expression is selected
            if (active === undefined || drag === undefined)
                return

            let dragging = state.components[active.id];
            let dropping = state.components[Number(over)];

            if (Components.canDrop(state, dragging, dropping)) {
                saveStateForUndo(state);
                Boards.dragInsideComponents(state, dragging, dropping)
            } else {
                saveStateForUndo(state);
                Boards.dragOutsideComponent(state, position, state.components[drag!!.id] as TreeComponent)
            }

            //state.active = undefined
        },
        copy: (state) => {
            if (!state.isEditable) return

            const active = state.active;

            //Check if an expression is selected
            if (active === undefined)
                return

            if (active.type === ComponentType.TREE)
                state.copy = active.id
            else if (active.parent && state.components[active.parent].type === ComponentType.TREE)
                state.copy = state.components[active.parent].id

        },
        paste: (state) => {
            if (!state.isEditable) return

            if (state.copy && state.copy in state.components) {
                saveStateForUndo(state);

                const newID = Boards.duplicateComponent(state, state.components[state.copy])
                let newComponent = state.components[newID]

                const previous = document.getElementById(String(state.copy))
                if (previous) {
                    const boundingBox = previous.getBoundingClientRect()
                    newComponent.position = Boards.computeBoardCoordinates({
                        x: boundingBox.x + 20,
                        y: boundingBox.y + 20
                    })
                    state.boardItems[newID] = newID
                    state.active = newComponent
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
    appendTree,
    selectComponent,
    selectDraggingComponent,
    selectEditingComponent,
    setEditable,
    updateComponent,
    deleteComponent,
    dragComponent,
    copy,
    paste,
    undo,
    redo,
} = slice.actions;

export const boardReducer = slice.reducer;
