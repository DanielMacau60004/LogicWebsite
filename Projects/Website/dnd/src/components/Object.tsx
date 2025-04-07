import React from "react";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {useSelector} from "react-redux";
import {GlobalState} from "../store";
import {Component} from "../store/board";
import {Element} from "./Expressions";

function hasValue(children: any) {
    return children && (!Array.isArray(children) || children[1])
}

export function Object(props: Component) {
    const {id, className, position, children, parent, transform} = props;
    const draggable = useDraggable({
        id: id,
    });
    const droppable = useDroppable({
        id: id,
    });

    const style = {
        position: "relative",
        top: `${position?.y ?? 0}px`,
        left: `${position?.x ?? 0}px`,
        ...(draggable.transform && {opacity: 0.5}),
        ...(draggable.transform && {zIndex: 1000}),
    } as React.CSSProperties;

    let classList = (hasValue(children) ? 'draggable ' : 'droppable ') + className;

    //TODO exclude trees from being droppable
    return (
        <div id={String(id)} ref={droppable.setNodeRef} className="component">
            {hasValue(children) ? (
                <div id={String(id)} ref={draggable.setNodeRef} style={style}{...draggable.listeners} className={classList}
                     {...draggable.attributes}>
                    {children}
                </div>
            ) : (
                <div style={style} className={classList}>+</div>
            )}
        </div>
    );


}