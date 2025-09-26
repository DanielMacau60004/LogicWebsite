import {useTransformContext} from "react-zoom-pan-pinch";
import {useDispatch, useSelector} from "react-redux";
import {addTree, setZoom} from "../../../../../store/boardSlice";
import {exp, treeExp} from "../../../models/components/components";
import {solveProblem} from "../../../services/requests";
import {GlobalState} from "../../../../../store";

export type Position = { x: number; y: number };

export function useToolsControl(zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void) {
    const dispatch = useDispatch();
    const {problem, isFOL, zoom, currentId, feedbackLevel, isEditable} = useSelector((state: GlobalState) => state.board)
    const state = useTransformContext();

    const handleAdderClick = () => {
        const {positionX, positionY, scale} = state.transformState;

        if (state.wrapperComponent) {
            const {clientWidth, clientHeight} = state.wrapperComponent as HTMLElement;
            const centerX = (-positionX + clientWidth / 2) / scale;
            const centerY = (-positionY + clientHeight / 2) / scale;

            const position: Position = {x: centerX, y: centerY};
            dispatch(addTree({component: treeExp(exp(), position), saveState: false}));
            setTimeout(() => {
                zoomToElement(String(currentId), zoom)
                dispatch(setZoom(zoom));
            }, 100)
        }
    };

    const handleSolverClick = () => {
        const {positionX, positionY, scale} = state.transformState;

        if (state.wrapperComponent && problem) {
            const {clientWidth, clientHeight} = state.wrapperComponent as HTMLElement;
            const centerX = (-positionX + clientWidth / 2) / scale;
            const centerY = (-positionY + clientHeight / 2) / scale;

            const position: Position = {x: centerX, y: centerY};

            const exercise = [...problem.premises, problem.conclusion]

            solveProblem(exercise, isFOL, feedbackLevel).then(response => {
                if (response) {
                    const solution = response;
                    solution.position = position;
                    dispatch(addTree({component: solution, saveState: false}));
                    setTimeout(() => {
                        zoomToElement(String(currentId), zoom)
                        dispatch(setZoom(zoom));
                    }, 100)
                }
            });
        }
    };

    const locked = !isEditable
    return {handleAdderClick, handleSolverClick, locked};
}
