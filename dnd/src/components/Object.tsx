import React from "react";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {canDrop, Component} from "../store/components";
import {useSelector} from "react-redux";
import {GlobalState} from "../store";

function hasValue(children: any) {
    return children && (!Array.isArray(children) || children[1])
}

export function Object(props: Component) {
    const {components, active} = useSelector((state: GlobalState) => state.board)
    const {id, className, position, children, droppableTypes} = props;
    const draggable = useDraggable({id: id,});
    const droppable = useDroppable({id: id,});

    const translation = {
        ...(active?.id === props.id && {zIndex: 1000}),
        transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`
    } as React.CSSProperties;

    const style = {
        ...(droppable.isOver && canDrop(components, active, props) && {scale: 1.3}),
        ...((draggable.transform) && {opacity: 0.5}),
        ...((draggable.transform) && {zIndex: 1000}),
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
        <div className="component" style={{ ...(props.style || {}), ...translation }}>
            {droppableTypes ? (
                <div id={String(id)} ref={droppable.setNodeRef}>
                    {getElement()}
                </div>
            ) : (getElement())}
        </div>
    );
}

