import React, {useState} from "react";
import {Button,} from "react-bootstrap";
import {FaArrowRotateLeft, FaArrowRotateRight} from "react-icons/fa6";
import "../style/Controls.css"
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../store";
import {redo, undo} from "../store/board";
import {useDroppable} from "@dnd-kit/core";
import {Droppable} from "./Droppable";

const TrashBin = () => {
    const droppable = useDroppable({id: 0});

    let className = ""
    if (droppable.isOver)
        className = "trash-open"

    return (
        <div id={String(0)} ref={droppable.setNodeRef} className={"trash-box"} >
            <span className="trash">
                <span className={className}></span>
                <i></i>
            </span>
        </div>
    );

}

export function Controls() {
    const dispatch: any = useDispatch()
    const {undoStack, redoStack} = useSelector((state: GlobalState) => state.board)

    return (
        <div>
            <div className="controls p-0 list-unstyled d-flex flex-row align-items-center">
                <div id="sidebar-collapse" className={"controls-content border shadow ms-2 p-1"}
                     onClick={() => dispatch(undo())}>
                    <Button className={"control"} disabled={undoStack.length === 0}>
                        <FaArrowRotateLeft size={25}/></Button>
                </div>
                <div id="sidebar-collapse" className={"controls-content border shadow ms-2 p-1"}>
                    <Button className={"control"} disabled={redoStack.length === 0}
                            onClick={() => dispatch(redo())}>
                        <FaArrowRotateRight size={25}/></Button>
                </div>
            </div>

            <div className="delete-control">
                <Droppable id={0} >
                    <TrashBin />
                </Droppable>
            </div>
        </div>

    )
}