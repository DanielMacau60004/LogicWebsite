import React from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";

import {ExpComponent, PreviewExpComponent} from "../../../types/proofBoard";
import {DroppableRender} from "../../../../../components/Droppable";
import {Components} from "../../../models/components/logic";
import {deepCopy} from "../../../../../utils/general";

const EMPTY_VALUE = ""


export function useExpPreview({exp}: { exp: PreviewExpComponent }) {
    const hasMarkValue = exp.mark && exp.mark.value !== undefined && exp.mark.value !== null;
    const markComponent = exp.mark ? (exp.mark) : undefined;
    const value = exp.value ? exp.value : EMPTY_VALUE

    return {value, hasMarkValue, markComponent};
}

export function useExp({exp}: { exp: ExpComponent }) {
    const state = useSelector((state: GlobalState) => state.board);

    const canDrag = Components.canDrop(state, state.active, exp) ||
        (state.active && state.active.id === exp.id);

    const hasMarkValue = exp.mark && state.components[exp.mark]?.value !== undefined &&
        state.components[exp.mark]?.value !== null;

    const markComponent = exp.mark ? (state.components[exp.mark] as any) : undefined;
    const isSelected = state.editing?.id === exp.id
    const value = exp.value ? exp.value : EMPTY_VALUE

    const show = Boolean(state.drag === undefined && (exp?.editable ?? true) &&
        Components.isLeaf(state, exp) &&
        (
            (state.active && state.active.id === exp.id) ||
            (state.active && state.active.parent === exp.id) ||
            (state.editing && exp.mark !== undefined && state.editing.id === exp.mark)
        ) && (exp.mark === undefined || markComponent?.value === undefined || markComponent?.value === null)
    );

    const onRender: (args: DroppableRender) => {
        className?: string;
        style?: React.CSSProperties;
    } = (args) => {
        const className = [
            args.className,
            state.active && state.active.id === exp.id ? "active" : "",
            exp.value ? "" : "empty",
            canDrag ? "highlight" : "",
            canDrag && args.droppable.isOver ? "highlight-hover" : "",
            //exp.isWFF === undefined || exp.isWFF ? "": "incorrect"
        ].join(" ").trim();


        return {className, style: args.style,};
    };

    return {isSelected, value, show, hasMarkValue, markComponent, onRender};
}