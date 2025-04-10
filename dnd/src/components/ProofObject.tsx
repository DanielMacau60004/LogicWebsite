import React from "react";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {canDropComponent, Component} from "../utils/components";
import {useSelector} from "react-redux";
import {GlobalState} from "../store";
import {Draggable} from "./Draggable";
import {Droppable} from "./Droppable";

function hasValue(children: any) {
    return children && (!Array.isArray(children) || children[1])
}

export function ProofObject(component: Component) {
    const {components, active} = useSelector((state: GlobalState) => state.board)
    const {id, style, className, position, children} = component;

    const translation = {
        ...(active?.id === component.id && {zIndex: 100}),
        transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`
    } as React.CSSProperties;

    // @ts-ignore
    const onDragging = ({draggable, className, style}) => {
        if (draggable.transform)
            style = { ...style, opacity: 0.5, zIndex: 100 };
        return { className, style };
    };

    // @ts-ignore
    const onDropping = ({droppable, className, style}) => {
        if (droppable.isOver && canDropComponent(components, active, component))
            style = { ...style, scale: 1.3 };
        return { className, style };
    };

    const mainClass = hasValue(children) ? `${className} draggable` : `${className} droppable`

    return (
        <div className={"component"} style={{...translation}}>
            <Droppable id={String(id)} onRender={onDropping}>
                {hasValue(children) ? (
                    <Draggable id={String(id)} className={mainClass} style={style} onRender={onDragging}>{children}</Draggable>
                ) : (<div className={mainClass}>+</div>)}
            </Droppable>
        </div>

    );
}
