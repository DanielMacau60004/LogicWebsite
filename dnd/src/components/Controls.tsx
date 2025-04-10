import React from "react";
import {Button,} from "react-bootstrap";
import {FaArrowRotateLeft, FaArrowRotateRight} from "react-icons/fa6";
import "../style/Controls.css"
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../store";
import {deleteItem, redo, selectItem, undo} from "../store/board";
import {DndContext, DragEndEvent, DragStartEvent, pointerWithin, useDroppable} from "@dnd-kit/core";
import {restrictToFirstScrollableAncestor} from "@dnd-kit/modifiers";

function TrashBin() {
    const id = -10000
    const {components, active} = useSelector((state: GlobalState) => state.board)
    const droppable = useDroppable({id: id,});

    return (
        <div id={String(id)} ref={droppable.setNodeRef}>
                          <span className="trash">
                            <span></span>
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
                <TrashBin/>
            </div>
        </div>

    )


}