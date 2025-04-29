import {GlobalState} from "../../../../../store";
import {useDispatch, useSelector} from "react-redux";
import {FaArrowRotateLeft, FaArrowRotateRight} from "react-icons/fa6";
import {Button} from "react-bootstrap";
import {redo, undo} from "../../../../../store/boardSlice";
import "./StateControl.scss"

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
    const dispatch: any = useDispatch()
    const {undoStack, redoStack} = useSelector((state: GlobalState) => state.board)

    return (
        <div className="state-controls p-0 list-unstyled d-flex flex-row align-items-center">
            <UndoState onClick={() => dispatch(undo())} disabled={undoStack.length === 0}/>
            <RedoState onClick={() => dispatch(redo())} disabled={redoStack.length === 0}/>
        </div>
    )
}