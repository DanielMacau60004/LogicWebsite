import {useDispatch, useSelector} from "react-redux";
import {redo, setZoom, undo} from "../../../../../store/boardSlice";
import {GlobalState} from "../../../../../store";
import {MAX_SCALE, MIN_SCALE} from "../../../constants";
import {ZoomControlProps} from "./ZoomControl";

export function useZoomControl({instance}: ZoomControlProps) {
    const {zoom} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const onZoomInClick = () => {
        instance.getContext().zoomIn()
        dispatch(setZoom(instance.getContext().state.scale))
    }
    const onZoomOutClick = () => {
        instance.getContext().zoomOut()
        dispatch(setZoom(instance.getContext().state.scale))
    }

    const canZoomIn = zoom >= MAX_SCALE
    const canZoomOut = zoom <= MIN_SCALE

    return {onZoomInClick, onZoomOutClick, canZoomIn, canZoomOut}
}
