import {useDraggable} from "@dnd-kit/core";
import React from "react";

type DraggableProps = {
    id: string | number;
    disabled?: boolean | false,
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    onRender?: (args: DraggableRender) => {
        className?: string;
        style?: React.CSSProperties;
    };
};

export type DraggableRender = {
    draggable: ReturnType<typeof useDraggable>;
    className?: string;
    style?: React.CSSProperties;
};

export function Draggable({
        id,
        disabled,
        className,
        style,
        children,
        onRender,
    }: DraggableProps) {

    const draggable = useDraggable({id, disabled});

    const {className: renderClassName, style: renderStyle} = onRender
        ? onRender({draggable, className, style})
        : {className, style};

    return (
        <div
            id={String(id)}
            ref={draggable.setNodeRef}
            {...draggable.attributes}
            {...draggable.listeners}
            className={renderClassName}
            style={renderStyle}
        >
            {children}
        </div>
    );
}