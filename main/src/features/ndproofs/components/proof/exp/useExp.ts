import React from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";

import {ExpComponent} from "../../../types/proofBoard";
import {DroppableRender} from "../../../../../components/Droppable";
import {Components} from "../../../models/components/logic";

const EMPTY_VALUE = ""

export function useExp({ exp }: { exp: ExpComponent }) {
    const state = useSelector((state: GlobalState) => state.board);

    const canDrag = Components.canDrop(state, state.active, exp) ||
        (state.active && state.active.id === exp.id);

    const hasMarkValue = exp.mark && state.components[exp.mark]?.value !== undefined;
    const markComponent = exp.mark ? (state.components[exp.mark] as any) : undefined;
    const isSelected = state.editing?.id === exp.id
    const value = exp.value ? exp.value : EMPTY_VALUE

    const show = Boolean(state.drag === undefined && (exp?.editable ?? true) &&
        Components.isLeaf(state, exp) &&
        (
            (state.active && state.active.id === exp.id) ||
            (state.active && state.active.parent === exp.id) ||
            (state.editing && exp.mark !== undefined && state.editing.id === exp.mark)
        ) && (exp.mark === undefined || markComponent?.value === undefined)
    );

    const onRender: (args: DroppableRender) => {
        className?: string;
        style?: React.CSSProperties;
    } = (args) => {
        const className = [
            args.className,
            state.active && state.active.id === exp.id ? "active": "",
            exp.value ? "" : "empty",
            canDrag ? "highlight" : "",
            canDrag && args.droppable.isOver ? "highlight-hover" : "",
        ].join(" ").trim();

        return {className, style: args.style,};
    };

    return {isSelected, value, show, hasMarkValue, markComponent, onRender,};
}