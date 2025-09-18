import React from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";

import {ExpComponent, PreviewExpComponent} from "../../../types/proofBoard";
import {DroppableRender} from "../../../../../components/Droppable";
import {Components} from "../../../models/components/logic";

export function useExpMenu({exp}: { exp: ExpComponent }) {
    const state = useSelector((state: GlobalState) => state.board);

    const markComponent = exp.mark ? (state.components[exp.mark] as any) : undefined;
    const showMark = Boolean(state.drag === undefined && (exp?.editable ?? true) &&
        Components.isLeaf(state, exp) &&
        (
            (state.active && state.active.id === exp.id) ||
            (state.active && state.active.parent === exp.id) ||
            (state.editing && exp.mark !== undefined && state.editing.id === exp.mark)
        ) && (exp.mark === undefined || markComponent?.value === undefined || markComponent?.value === null)
    );

    const showRuleTop = showMark
    const showRuleBottom = Boolean(state.drag === undefined && (exp?.editable ?? true) &&
        Components.isConclusion(state, exp) && Components.getLastParent(state,  exp).id === exp.parent &&
        (
            (state.active && state.active.id === exp.id) ||
            (state.active && state.active.parent === exp.id) ||
            (state.editing && exp.mark !== undefined && state.editing.id === exp.mark)
        ) && (exp.mark === undefined || markComponent?.value === undefined || markComponent?.value === null)
    );



    return {showMark, showRuleTop, showRuleBottom};
}