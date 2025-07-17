import {Button} from "react-bootstrap";
import "./BoardControl.scss"
import {useZoomControl} from "./useZoomControl";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import {ReactZoomPanPinchContext} from "react-zoom-pan-pinch";
import { FaLock, FaUnlock } from "react-icons/fa";
import {useLockControl} from "./useLockControl";
import { TiZoomInOutline,TiZoomOut } from "react-icons/ti";

type ZoomButtonProps = {
    disabled: boolean;
    onClick: () => void;
};

function ZoomIn({onClick, disabled}: ZoomButtonProps) {
    return (
        <Button className={"board-controls-btn mb-2 p-1"} onClick={onClick} disabled={disabled}>
            <TiZoomInOutline  size={40}/>
        </Button>
    )
}

function ZoomOut({onClick, disabled}: ZoomButtonProps) {
    return (
        <Button className={"board-controls-btn mb-2 p-1"} onClick={onClick} disabled={disabled}>
            <TiZoomOut size={40}/>
        </Button>
    )
}

type LockButtonProps = {
    locked: boolean;
    onUnlock: () => void;
    onLock: () => void;
};

export function LockButton({ locked, onUnlock, onLock }: LockButtonProps) {

    return (
        <Button
            className={`board-controls-btn mb-2 ${!locked ? "board-control-disabled" : ""}`}
            onClick={locked ? onUnlock : onLock}
            title={locked ? "Unlock" : "Lock"}
        >
            {!locked ? <FaLock size={20} /> : <FaUnlock size={20} />}
        </Button>
    );
}

export type BoardControlProps = {
    instance: ReactZoomPanPinchContext;
};

export function BoardControl({instance}: BoardControlProps) {
    const {onZoomInClick, onZoomOutClick, canZoomIn, canZoomOut} = useZoomControl({instance})
    const { locked, onUnlock, onLock } = useLockControl()
    return (
        <div className="board-controls p-0 list-unstyled d-flex flex-column align-items-center">
            <ZoomIn onClick={onZoomInClick} disabled={canZoomIn}/>
            <ZoomOut onClick={onZoomOutClick} disabled={canZoomOut}/>
            <LockButton locked={locked} onUnlock={onUnlock} onLock={onLock}/>
        </div>
    )
}