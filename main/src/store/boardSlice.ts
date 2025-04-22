import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {deepCopy} from "../utils/general";
import {Board, Component, ComponentType, Position, TreeComponent} from "../features/ndproofs/types/proofBoard";
import {
    computeBoardCoordinates,
    computeRelativeCoordinates,
    duplicateComponent,
    proofBoard,
} from "../features/ndproofs/models/proofBoard";
import {Components} from "../features/ndproofs/models/proofComponents";

const MOVEMENT_THRESHOLD = 10;
const MAX_HISTORY_DEPTH = 20;

export function cloneState(state: Board): Omit<Board, 'redoStack' | 'undoStack' | 'sideBarItems'> {
    return {
        currentId: state.currentId,
        active: state.active ? deepCopy(state.active) : undefined,
        drag: state.drag ? deepCopy(state.drag) : undefined,
        copy: state.copy ? deepCopy(state.copy) : undefined,
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

function dragInsideComponents(state: Board, elem1: Component, elem2: Component) {
    const isDroppingConclusion = Components.isConclusion(state, elem2);
    const dragging = !isDroppingConclusion ? state.components[elem1.parent!!] : state.components[elem2.parent!!]
    const dropping = isDroppingConclusion ? state.components[elem1.id] : state.components[elem2.id]

    const parentDragging = Components.getLastParent(state, dropping)
    const parentDropping = Components.getLastParent(state, dragging)

    const pDragging = state.components[dragging.parent!!]
    const pDropping = state.components[dropping.parent!!]

    state.components[dragging.id].parent = pDropping.id
    state.components[dropping.id].parent = pDragging?.id

    const dragIndex = pDragging?.hypotheses.indexOf(dragging.id)
    const dropIndex = pDropping?.hypotheses.indexOf(dropping.id)

    if (dropIndex !== undefined) pDropping.hypotheses[dropIndex] = dragging.id
    else pDropping.conclusion = dragging.id

    if (pDragging) {
        if (dragIndex !== undefined) pDragging.hypotheses[dragIndex] = dropping.id
        else pDragging.conclusion = dropping.id
    } else {
        delete state.boardItems[dragging.id];
        delete state.components[dropping.id];
    }

    //Fix position
    if (isDroppingConclusion) {
        parentDragging.position = {...parentDropping.position}
        parentDropping.position = undefined
    } else {
        state.components[dragging.id].position = undefined
        if (state.components[dropping.id])
            state.components[dropping.id].position = undefined
    }

}

//Drop an element out of other
function dragOutsideComponent(state: Board, position: Position, dragging: TreeComponent) {
    let element = dragging;

    if (dragging.parent !== undefined) {
        const newID = state.currentId++;
        const element = Components.reset(dragging)
        element.id = newID;
        state.components[newID] = element;

        const pDragging = state.components[dragging.parent]
        const dragIndex = pDragging?.hypotheses.indexOf(dragging.id)

        if (dragIndex !== undefined) pDragging.hypotheses[dragIndex] = element.id
        else pDragging.conclusion = element.id

        state.boardItems[dragging.id] = dragging.id;
        dragging.parent = undefined;
        dragging.position = computeRelativeCoordinates(dragging.id)
        console.log(deepCopy(element))
    }

    if (element.position) {
        element.position.x += position.x;
        element.position.y += position.y;

    } else
        element.position = {...position};

}

const slice = createSlice({
    name: 'board',
    initialState: proofBoard(),
    reducers: {
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
        updateComponent: (state, action: PayloadAction<Component>) => {
            saveStateForUndo(state);
            const component = action.payload
            state.components[component.id] = component
            state.editing = component
        },
        deleteComponent: (state) => {
            if (!state.isEditable) return

            const active = state.active;
            if (active) {
                saveStateForUndo(state);

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
            const active = state.active;

            //Check if the movement is big enough to trigger the drag event
            if (Math.abs(position.x) + Math.abs(position.y) < MOVEMENT_THRESHOLD)
                return

            //Check if an expression is selected
            if (active === undefined)
                return

            let dragging = state.components[active.id];
            let dropping = state.components[Number(over)];

            if (Components.canDrop(state, dragging, dropping)) {
                saveStateForUndo(state);
                dragInsideComponents(state, dragging, dropping)
            } else {
                saveStateForUndo(state);
                dragOutsideComponent(state, position, state.components[state.drag!!.id] as TreeComponent)
            }

            state.active = undefined
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

                const newID = duplicateComponent(state, state.components[state.copy])
                let newComponent = state.components[newID]

                //TODO change to the mouse pointer
                const previous = document.getElementById(String(state.copy))
                if (previous) {
                    const boundingBox = previous.getBoundingClientRect()
                    newComponent.position = computeBoardCoordinates({x: boundingBox.x + 20, y: boundingBox.y + 20})
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
