import {configureStore} from "@reduxjs/toolkit"
import {boardReducer} from "./boardSlice";
import {Board} from "../features/ndproofs/types/proofBoard";

export interface GlobalState {
    board: Board,
}

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
});