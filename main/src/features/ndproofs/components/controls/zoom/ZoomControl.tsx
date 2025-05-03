import {GlobalState} from "../../../../../store";
import {useDispatch, useSelector} from "react-redux";
import {FaArrowRotateLeft, FaArrowRotateRight} from "react-icons/fa6";
import {Button} from "react-bootstrap";
import {redo, undo} from "../../../../../store/boardSlice";
import "./ZoomControl.scss"
import {useZoomControl} from "./useZoomControl";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import {ReactZoomPanPinchContentRef, ReactZoomPanPinchContext, ReactZoomPanPinchRef} from "react-zoom-pan-pinch";

type ZoomButtonProps = {
    disabled: boolean;
    onClick: () => void;
};

function ZoomIn({onClick, disabled}: ZoomButtonProps) {
    return (
        <Button className={"zoom-controls-btn mb-2"} onClick={onClick} disabled={disabled}>
            <FaPlus size={20}/>
        </Button>
    )
}

function ZoomOut({onClick, disabled}: ZoomButtonProps) {
    return (
        <Button className={"zoom-controls-btn mb-2"} onClick={onClick} disabled={disabled}>
            <FaMinus size={20}/>
        </Button>
    )
}

export type ZoomControlProps = {
    instance: ReactZoomPanPinchContext;
};

export function ZoomControl({instance}: ZoomControlProps) {
    const {onZoomInClick, onZoomOutClick, canZoomIn, canZoomOut} = useZoomControl({instance})

    return (
        <div className="zoom-controls p-0 list-unstyled d-flex flex-column align-items-center">
            <ZoomIn onClick={onZoomInClick} disabled={canZoomIn}/>
            <ZoomOut onClick={onZoomOutClick} disabled={canZoomOut}/>
        </div>
    )
}