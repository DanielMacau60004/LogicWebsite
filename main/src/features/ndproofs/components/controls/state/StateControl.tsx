import {FaArrowRotateLeft, FaArrowRotateRight} from "react-icons/fa6";
import {Button} from "react-bootstrap";
import "./StateControl.scss"
import {useStateControl} from "./useStateControl";

type StateButtonProps = {
    disabled: boolean;
    onClick: () => void;
};

function UndoState({onClick, disabled}: StateButtonProps) {
    return (
        <Button className={"state-controls-btn ms-2"} onClick={onClick} disabled={disabled}>
            <FaArrowRotateLeft size={25}/>
        </Button>
    )
}

function RedoState({onClick, disabled}: StateButtonProps) {
    return (
        <Button className={"state-controls-btn ms-2"} onClick={onClick} disabled={disabled}>
            <FaArrowRotateRight size={25}/>
        </Button>
    )
}

export function StateControl() {
    const {onUndo, onRedo, canRedo, canUndo} = useStateControl();

    return (
        <div className="state-controls p-0 list-unstyled d-flex flex-row align-items-center">
            <UndoState onClick={onUndo} disabled={canUndo}/>
            <RedoState onClick={onRedo} disabled={canRedo}/>
        </div>
    )
}