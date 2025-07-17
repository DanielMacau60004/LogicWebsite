import {Modifier} from "@dnd-kit/core";
import {Transform} from "@dnd-kit/utilities/dist/css";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ReactZoomPanPinchRef} from "react-zoom-pan-pinch";
import {selectEditingComponent, setZoom} from "../../../../store/boardSlice";

export function useZoom () {
    const {zoom} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const zoomModifier: Modifier = ({ transform }: { transform: Transform }) => {
        return {
            ...transform,
            x: transform.x / zoom,
            y: transform.y / zoom,
        };
    };

    function onZoom(e: ReactZoomPanPinchRef) {
        dispatch(selectEditingComponent(undefined))
        dispatch(setZoom(e.state.scale));
    }

    return {zoomModifier, onZoom}

}