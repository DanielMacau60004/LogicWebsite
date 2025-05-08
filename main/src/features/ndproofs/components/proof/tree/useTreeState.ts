import { useSelector } from "react-redux";
import React from "react";
import {ComponentType, TreeComponent} from "../../../types/proofBoard";
import {GlobalState} from "../../../../../store";
import {DraggableRender} from "../../../../../components/Draggable";
import {Components} from "../../../models/components/logic"; // Adjust if needed

export function useTreeState(tree: TreeComponent) {
    const state = useSelector((state: GlobalState) => state.board);
    const { drag, active, editing } = state;

    const isRoot = tree.parent === undefined && !tree.cloned;

    const isActive =
        (active && Components.getLastParent(state, active).id === tree.id) ||
        (editing && Components.getLastParent(state, editing).id === tree.id);

    const isSelected = active && active.id && active.type === ComponentType.TREE &&
        Components.getLastParent(state, active).id === tree.id;

    const onRender: (args: DraggableRender) => {
        className?: string;
        style?: React.CSSProperties;
    } = (args) => {

        //TODO temporary!!
        const lastParent = Components.getLastParent(state, tree)
        const isIncorrect = (tree.isWFP !== undefined && !tree.isWFP) ||
            (lastParent.isWFP !== undefined && !lastParent.isWFP)

        const className = [
            tree.className,
            args.className,
            isIncorrect ? "incorrect" : ""
        ].join(" ").trim();

        return {
            className: className,
            style: {
                ...args.style,
                ...(isActive && { zIndex: 100 }),
                ...(args.draggable.active?.id === tree.id && { opacity: 1 }),
                ...(args.draggable.isDragging && !tree.parent && drag && { opacity: 0 }),
                transform: `translate(${(tree.position?.x ?? 0)}px, ${(tree.position?.y ?? 0)}px)`
            },
        };
    };

    return {drag, isRoot, isSelected, onRender,};
}
