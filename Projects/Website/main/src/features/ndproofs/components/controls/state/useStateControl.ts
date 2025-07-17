import {useDispatch, useSelector} from "react-redux";
import {redo, undo} from "../../../../../store/boardSlice";
import {GlobalState} from "../../../../../store";

export function useStateControl() {
    const {undoStack, redoStack} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const onUndo = () => dispatch(undo())
    const onRedo = () => dispatch(redo())
    const canUndo = undoStack.length === 0
    const canRedo = redoStack.length === 0

    return {onUndo, onRedo, canRedo, canUndo}
}
