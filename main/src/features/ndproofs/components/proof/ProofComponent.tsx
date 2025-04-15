import {useProofComponent} from "./useProofComponent";
import React from "react";
import './ProofComponent.scss';
import {BoardComponent} from "../../types/proofBoard";
import {DragDrop} from "../../../../components/DragDrop";

export const ProofComponent = (component: BoardComponent) => {
    const {className, style, children, isDraggable, isDroppable} = component
    const {
        id,
        hasValue,
        style: newStyle,
        className: newClassName,
        onRender
    } = useProofComponent(component, children, className, style);

    return (
        <DragDrop id={id} className={newClassName} style={newStyle} onRender={onRender} disableDrag={!isDraggable}
                  disableDrop={!isDroppable}>
            <div className={"proof-component-content"}>
                {hasValue ? children : "+"}
            </div>
        </DragDrop>
    );
};
