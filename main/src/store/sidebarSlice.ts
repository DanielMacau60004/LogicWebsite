import {createSlice} from "@reduxjs/toolkit";
import {proofBoard} from "../features/ndproofs/models/proofBoard";

const slice = createSlice({
    name: 'sidebar',
    initialState: proofBoard(),
    reducers: {}
})

export const {} = slice.actions;

export const sidebarReducer = slice.reducer;