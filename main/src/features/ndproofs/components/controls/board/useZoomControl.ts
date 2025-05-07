import {useDispatch, useSelector} from "react-redux";
import {setZoom} from "../../../../../store/boardSlice";
import {GlobalState} from "../../../../../store";
import {MAX_SCALE, MIN_SCALE} from "../../../constants";
import {BoardControlProps} from "./BoardControl";

export function useZoomControl({instance}: BoardControlProps) {
    const {zoom} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const onZoomInClick = () => {
        instance.getContext().zoomIn()

        //Necessary because the value of the zoom only changes when the zoomIn effect finishes
        setTimeout(() => {dispatch(setZoom(instance.getContext().state.scale));}, 500);
    }
    const onZoomOutClick = () => {
        instance.getContext().zoomOut()

        //Necessary because the value of the zoom only changes when the zoomOut effect finishes
        setTimeout(() => {dispatch(setZoom(instance.getContext().state.scale));}, 500);
    }

    const canZoomIn = zoom >= MAX_SCALE
    const canZoomOut = zoom <= MIN_SCALE

    return {onZoomInClick, onZoomOutClick, canZoomIn, canZoomOut}
}
