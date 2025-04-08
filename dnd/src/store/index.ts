import {configureStore} from "@reduxjs/toolkit"
import {BoardState, boardReducer} from "./board";

export interface GlobalState {
    board: BoardState,
}

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
});