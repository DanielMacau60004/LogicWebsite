import {useDroppable} from "@dnd-kit/core";
import React from "react";

export function Droppable(props: any) {
    const {id, className, style, children, onRender} = props;
    const droppable = useDroppable({id: id});

    const { className: dragClassName, style: dragStyle } = onRender
        ? onRender({ droppable, className, style })
        : { className, style };

    return (
        <div id={String(id)} ref={droppable.setNodeRef} className={dragClassName} style={dragStyle}>
            {children}
        </div>
    );
}