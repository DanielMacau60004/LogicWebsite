import {useDroppable} from "@dnd-kit/core";
import React from "react";

type DroppableProps = {
    id: string | number;
    disabled?: boolean | false,
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    onRender?: (args: DroppableRender) => {
        className?: string;
        style?: React.CSSProperties;
    };
};

export type DroppableRender = {
    droppable: ReturnType<typeof useDroppable>;
    className?: string;
    style?: React.CSSProperties;
};

export function Droppable({
        id,
        disabled,
        className,
        style,
        children,
        onRender
    }: DroppableProps) {


    const droppable = useDroppable({id, disabled});

    const {className: renderClassName, style: renderStyle} = onRender
        ? onRender({droppable, className, style})
        : {className, style};

    return (
        <div
            id={String(id)}
            ref={droppable.setNodeRef}
            className={renderClassName}
            style={renderStyle}
        >
            {children}
        </div>
    );
}