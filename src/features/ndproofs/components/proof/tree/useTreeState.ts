import { useSelector } from "react-redux";
import React, {useCallback} from "react";
import {ComponentType, TreeComponent} from "../../../types/proofBoard";
import {GlobalState} from "../../../../../store";
import {DraggableRender} from "../../../../../components/Draggable";
import {Components} from "../../../models/components/logic";
import {Boards} from "../../../models/board/logic"; // Adjust if needed

export function useTreeState(tree: TreeComponent) {
    const state = useSelector((state: GlobalState) => state.board);
    const { drag, active, editing } = state;
    const hasErrors = Boards.hasErrors(state, Boards.convertToPreview(state, tree.id));

    const isRoot = tree.parent === undefined && !tree.cloned;

    const isActive =
        (active && Components.getLastParent(state, active).id === tree.id) ||
        (editing && Components.getLastParent(state, editing).id === tree.id);

    const isSelected = active && active.id && active.type === ComponentType.TREE &&
        Components.getLastParent(state, active).id === tree.id;

    const shouldCompareConclusion = state.problem! && state.components[tree.conclusion].value === state.problem.conclusion

    const onRender = useCallback((args: DraggableRender) => {
        const lastParent = Components.getLastParent(state, tree);
        const isIncorrect =
            (tree.isWFP !== undefined && !tree.isWFP) ||
            (lastParent.isWFP !== undefined && !lastParent.isWFP);

        const className = [
            tree.className,
            args.className,
            isIncorrect ? "incorrect" : "",
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

        const style: React.CSSProperties = {
            ...args.style,
            ...(isActive && { zIndex: 100 }),
            ...(args.draggable.active?.id === tree.id && { opacity: 1 }),
            ...(tree.drag === undefined &&
                !tree.parent &&
                drag &&
                drag.id === tree.id && { opacity: 0 }),
            transform: `translate(${tree.position?.x ?? 0}px, ${tree.position?.y ?? 0}px)`,
        };

        return { className, style };
    }, [tree, state, drag, isActive]);

    return {drag, isRoot, isSelected, shouldCompareConclusion, hasErrors, onRender};
}
