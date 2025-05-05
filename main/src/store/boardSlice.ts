import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {deepCopy} from "../utils/general";
import {
    Board,
    Component,
    ComponentType,
    Position,
    PreviewTreeComponent,
    RuleComponent,
    TreeComponent
} from "../features/ndproofs/types/proofBoard";
import {board,} from "../features/ndproofs/models/board/board";
import {Boards} from "../features/ndproofs/models/board/logic";
import {Components} from "../features/ndproofs/models/components/logic";
import {BoardDrag} from "../features/ndproofs/models/board/drag";
import {BoardPosition} from "../features/ndproofs/models/board/position";
import {MAX_SCALE, MIN_SCALE} from "../features/ndproofs/constants";

const MOVEMENT_THRESHOLD = 10;
const MAX_HISTORY_DEPTH = 20;

function cloneState(state: Board): Omit<Board, 'redoStack' | 'undoStack'> {
    return {
        currentId: state.currentId,
        active: undefined,
        drag: undefined,
        copy: undefined,
        isEditable: true,
        editing: undefined,
        boardItems: deepCopy(state.boardItems),
        components: deepCopy(state.components),
        zoom: state.zoom,
        exercise: state.exercise,
        isFOL: state.isFOL
    };
}

function saveStateForUndo(state: Board) {
    state.undoStack.push(cloneState(state));

    if (state.undoStack.length > MAX_HISTORY_DEPTH) state.undoStack.shift();
    state.redoStack = [];
}

const slice = createSlice({
    name: 'board',
    initialState: board(),
    reducers: {
        appendTree: (state, action: PayloadAction<PreviewTreeComponent>) => {
            if (!state.active || !state.active.parent) return
            saveStateForUndo(state);

            const newTree = Boards.appendTree(state, action.payload)
            if (newTree) {
                const tree = state.components[newTree]
                Boards.updateRule(state, state.components[tree.rule] as RuleComponent,
                    tree as TreeComponent)
            }

            state.active = undefined
        },
        selectComponent: (state, action: PayloadAction<Component | undefined>) => {
            state.active = action.payload;
        },
        selectDraggingComponent: (state, action: PayloadAction<TreeComponent | undefined>) => {
            state.drag = action.payload;

            if (state.drag !== undefined)
                state.drag = {...state.drag, position: BoardPosition.computeRelativeCoordinates(state, state.drag.id)}
        },
        selectEditingComponent: (state, action: PayloadAction<Component | undefined>) => {
            state.editing = action.payload;
        },
        setEditable: (state, action: PayloadAction<boolean>) => {
            state.isEditable = action.payload
        },
        updateComponent: (state, action: PayloadAction<{ component: Component, saveState: boolean }>) => {
            const {component, saveState} = action.payload

            if (saveState) saveStateForUndo(state);

            if (component.type === ComponentType.RULE && state.editing?.parent) {
                Boards.updateRule(state, component as RuleComponent,
                    state.components[state.editing.parent] as TreeComponent)
            } else state.components[component.id] = component
            //state.editing = component
        },
        deleteComponent: (state) => {
            if (!state.isEditable) return

            const active = state.active;
            if (active && state.drag === undefined) {
                saveStateForUndo(state);

                if (active.type === ComponentType.RULE && state.active?.parent) {
                    Boards.updateRule(state, {...active, value: undefined} as RuleComponent,
                        state.components[state.active.parent] as TreeComponent)
                } else {

                    Boards.deleteEntireComponent(state, active)

                    if (active.parent) {
                        const parent = state.components[active.parent]
                        if (Components.isASimpleTree(parent) && parent.parent) {
                            state.components[parent.id] = Components.reset(state, parent, parent.id)
                        } else
                            state.components[active.id] = Components.reset(state, active, active.id)
                    } else {
                        delete state.boardItems[active.id];
                        delete state.components[active.id];
                    }
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
                BoardDrag.dragInsideComponents(state, dragging, dropping)
            } else {
                saveStateForUndo(state);
                BoardDrag.dragOutsideComponent(state, position, state.components[drag!!.id] as TreeComponent)
            }

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
                    newComponent.position = BoardPosition.computeBoardCoordinates(state, {
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
        },
        setZoom: (state, action: PayloadAction<number>) => {
            state.zoom = Number((Math.min(Math.max(action.payload, MIN_SCALE), MAX_SCALE)).toFixed(2))
        },
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
    setZoom,
} = slice.actions;

export const boardReducer = slice.reducer;
