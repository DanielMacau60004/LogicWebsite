import {useSelector} from "react-redux";
import React from "react";
import {GlobalState} from "../../../../store";
import {BoardComponent} from "../../types/proofBoard";
import {canDropComponent} from "../../models/proofBoardComponents";
import {DragDropRender} from "../../../../components/DragDrop";

export const useProofComponent = (
    component: BoardComponent,
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties
) => {
    const {id, position} = component
    const state = useSelector((state: GlobalState) => state.board);
    const hasValue = children && (!Array.isArray(children) || children[1])

    style = {
        ...style,
        ...(state.active?.id === component.id && {zIndex: 100}),
        transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`
    };

    if (state.active?.id === component.id) className += ' active'
    if (component.isDroppable && !hasValue) className += ' droppable'
    if (component.isDraggable) className += ' draggable'

    const onRender = ({draggable, droppable, className, style}: DragDropRender) => {
        if (draggable.isDragging)
            className += ' dragging';
        if (droppable.isOver && canDropComponent(state, state.active, component))
            className += ' dropping';
        return {className, style};
    };

    return {id: String(id), hasValue, style, className, onRender};
};