import {createSlice} from "@reduxjs/toolkit";
import {board} from "../features/ndproofs/models/board/board";

const slice = createSlice({
    name: 'sidebar',
    initialState: board(),
    reducers: {}
})

export const {} = slice.actions;

export const sidebarReducer = slice.reducer;