import {useDispatch, useSelector} from "react-redux";
import { setEditable} from "../../../../../store/boardSlice";
import {GlobalState} from "../../../../../store";

export function useLockControl() {
    const {isEditable} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const onUnlock = () => {
        dispatch(setEditable(false))
    }
    const onLock = () => {
        dispatch(setEditable(true))
    }

    const locked = isEditable
    return { locked, onUnlock, onLock }
}
