import React from "react";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {canDrop, Component} from "../store/components";
import {useSelector} from "react-redux";
import {GlobalState} from "../store";

function hasValue(children: any) {
    return children && (!Array.isArray(children) || children[1])
}

export function Object(props: Component) {
    const {active} = useSelector((state: GlobalState) => state.board)
    const {id, className, position, children, droppableTypes} = props;
    const draggable = useDraggable({id: id,});
    const droppable = useDroppable({id: id,});

    const translation = {
        position: "relative",
        top: `${position?.y ?? 0}px`,
        left: `${position?.x ?? 0}px`
    } as React.CSSProperties;

    const style = {
        zIndex: active?.id === props.id ? 10000 : 1,
        ...(droppable.isOver && canDrop(active, props) && {scale: 1.4}),
        ...(draggable.transform && {opacity: 0.5}),
        ...(draggable.transform && {zIndex: 1000}),
    } as React.CSSProperties;

    let classList = (hasValue(children) ? 'draggable ' : 'droppable ') + className;

    function getElement() {
        return (
            hasValue(children) ? (
                <div id={String(id)} ref={draggable.setNodeRef} style={style}{...draggable.listeners}
                     className={classList} {...draggable.attributes}>
                    {children}
                </div>
            ) : (<div style={style} className={classList}>+</div>)
        );
    }

    return (
        <div className="component" style={translation}>
            {droppableTypes !== undefined ? (
                <div id={String(id)} ref={droppable.setNodeRef}>
                    {getElement()}
                </div>
            ) : (getElement())}
        </div>
    );
}

