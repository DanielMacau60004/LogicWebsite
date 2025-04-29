import {useDraggable, useDroppable} from "@dnd-kit/core";
import React from "react";

type DragDropProps = {
    id: string | number;
    disableDrag?: boolean | false,
    disableDrop?: boolean | false,
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    onRender?: (args: DragDropRender) => {
        className?: string;
        style?: React.CSSProperties;
    };
};


export type DragDropRender = {
    draggable: ReturnType<typeof useDraggable>;
    droppable: ReturnType<typeof useDroppable>;
    className?: string;
    style?: React.CSSProperties;
};

export function DragDrop(
    {
        id,
        disableDrag,
        disableDrop,
        className,
        style,
        children,
        onRender
    }: DragDropProps) {

    const draggable = useDraggable({id, disabled: disableDrag});
    const droppable = useDroppable({id, disabled: disableDrop});

    const {className: resultClassName, style: resultStyle} = onRender
        ? onRender({draggable, droppable, className, style})
        : {className, style};

    return (
        <div
            id={String(id)}
            ref={(node) => {
                droppable.setNodeRef(node);
                draggable.setNodeRef(node);
            }}

            className={resultClassName}
            style={resultStyle}
            {...draggable.attributes}
            {...draggable.listeners}
        >
            {children}

        </div>
    );
}