import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {boardItems, components} from './boardInit';
import {canDrop, Component, Position, reset} from "./components";

export interface BoardState {
    active: Component | undefined;
    boardItems: { [key: number]: number };
    components: { [key: number]: Component };
    undoStack: Omit<BoardState, 'undoStack' | 'redoStack'>[];
    redoStack: Omit<BoardState, 'undoStack' | 'redoStack'>[];
}

const initialState: BoardState = {
    active: undefined,
    boardItems: boardItems,
    components: components,
    undoStack: [],
    redoStack: []
};

const MAX_HISTORY_DEPTH = 10;

function cloneState(state: BoardState): Omit<BoardState, 'undoStack' | 'redoStack'> {
    return {
        active: state.active,
        boardItems: {...state.boardItems},
        components: {...state.components}
    };
}

function saveStateForUndo(state: BoardState) {
    state.undoStack.push(cloneState(state));

    if (state.undoStack.length > MAX_HISTORY_DEPTH) state.undoStack.shift();
    state.redoStack = [];
}

const slice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        selectItem: (state, action: PayloadAction<number>) => {
            state.active = state.components[action.payload];
        },
        deleteItem: (state) => {
            const active = state.active;
            console.log(active)
            if (active) {
                saveStateForUndo(state);
                delete state.boardItems[active.id];
                delete state.components[active.id];
                state.active = undefined;
            }
        },
        dragItem: (state, action: PayloadAction<{ over?: number, position: Position }>) => {
            const {over, position} = action.payload;

            const active = state.active;

            if (active) {
                let dragging = state.components[active.id];
                const dropping = state.components[Number(over)];

                if (canDrop(dragging, dropping)) {
                    saveStateForUndo(state);

                    const tempValue = dragging.value;
                    dragging.value = dropping.value;
                    dropping.value = tempValue;

                    if(dragging.parent === undefined)
                        delete state.components[dragging.id];

                    //state.active = undefined;
                }

                else if (dragging) {
                    saveStateForUndo(state);

                    let element = dragging

                    if (dragging.parent !== undefined) {//Add new item
                        const newID = Object.keys(state.components).length;
                        element = {...dragging}
                        element.id = newID
                        state.components[newID] = element
                        state.boardItems[newID] = newID
                        element.parent = undefined

                        /*const HTML = document.getElementById(String(dragging.id))
                        if(HTML)  {
                            const {x, y} = HTML.getBoundingClientRect()
                            console.log(position)
                            element.position = {x:x,y:y}
                        }*/

                        state.components[dragging.id] = reset(dragging);
                    }

                    if (element.position) {
                        element.position.x += position.x;
                        element.position.y += position.y;
                    } else {
                        element.position = position;
                    }

                    //state.active = undefined;
                }
            }

        },
        undo: (state) => {
            if (state.undoStack.length === 0) return;

            const prevState = state.undoStack.pop();
            if (prevState) {
                state.redoStack.push(cloneState(state));
                Object.assign(state, prevState);
                console.log(prevState)
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

export const {selectItem, deleteItem, dragItem, undo, redo} = slice.actions;

export const boardReducer = slice.reducer;
