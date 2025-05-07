import { useTransformContext } from "react-zoom-pan-pinch";
import {useDispatch} from "react-redux";
import {appendExpTree} from "../../../../../store/boardSlice";
import {exp, treeExp} from "../../../models/components/components";

export type Position = { x: number; y: number };

export function useAddedControl() {
    const dispatch = useDispatch();
    const state = useTransformContext();

    const handleAdderClick = () => {
        const { positionX, positionY, scale } = state.transformState;

        if (state.wrapperComponent) {
            const { clientWidth, clientHeight } = state.wrapperComponent as HTMLElement;
            const centerX = (-positionX + clientWidth / 2) / scale;
            const centerY = (-positionY + clientHeight / 2) / scale;

            const position: Position = { x: centerX, y: centerY };
            dispatch(appendExpTree(treeExp(exp(), position)));
        }
    };

    return {handleAdderClick};
}
