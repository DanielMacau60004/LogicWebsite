import {DraggableAttributes, useDraggable} from "@dnd-kit/core";
import React from "react";

export function Draggable(props: any) {
    const {id, className, style, children, onRender} = props;
    const draggable = useDraggable({id: id});

    const { className: dragClassName, style: dragStyle } = onRender
        ? onRender({ draggable, className, style })
        : { className, style };

    return (
        <div id={String(id)} ref={draggable.setNodeRef} {...draggable.attributes} {...draggable.listeners}
             className={dragClassName} style={dragStyle}>
            {children}
        </div>
    );
}