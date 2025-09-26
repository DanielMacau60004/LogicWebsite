import "./DangerControl.scss"
import {Button} from "react-bootstrap";
import {FaPlus} from "react-icons/fa";

import {useToolsControl} from "./useToolsControl";
import {VscOutput} from "react-icons/vsc";
import { RiTreeLine } from "react-icons/ri";

import { TbHelp } from "react-icons/tb";
import { TbHelpOff } from "react-icons/tb";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {switchFeedbackLevel, switchFOL, switchHelpMode} from "../../../../../store/boardSlice";
import {feedbackLevels} from "../../../types/feedback";


function SolverBtn({zoomToElement}: {
    zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void
}) {
    const isEditable = useSelector((state: GlobalState) => state.board.isEditable);
    const {handleSolverClick} = useToolsControl(zoomToElement)

    return (
        <Button
                disabled={!isEditable}
                className={`danger-controls-btn ms-1 mt-1 ${!isEditable ? "danger-controls-locked" : ""}`}
                onMouseDown={handleSolverClick} title="Solve exercise">
            <VscOutput size={25}/>
        </Button>
    )
}

function HelperBtn() {
    const {isHelpMode, isEditable} = useSelector((state: GlobalState) => state.board)
    const dispatch = useDispatch();

    return (
        <Button className={`danger-controls-btn ms-1 mt-1 ${!isEditable ? "danger-controls-locked" : ""}`}
                disabled={!isEditable}
        onClick={()=>{
            dispatch(switchHelpMode())
        }} title={isHelpMode ? "Show rules tooltip" : "Hide rules tooltip"}>

            {isHelpMode && <TbHelp  size={25}/>}
            {!isHelpMode && <TbHelpOff  size={25}/>}
        </Button>
    )
}

function FeedbackLevelBtn() {
    const {feedbackLevel, isEditable} = useSelector((state: GlobalState) => state.board)
    const dispatch = useDispatch();

    return (
        <button
            disabled={!isEditable}
            onClick={() => {dispatch(switchFeedbackLevel());}}
            className={`danger-controls-btn ms-1 mt-1 ${!isEditable ? "danger-controls-locked" : ""}`}
            title={"Feedback level\n" + feedbackLevel}
        >
            {"❙".repeat(feedbackLevels.indexOf(feedbackLevel)+1)}
        </button>
    );
}

function LanguageBtn() {
    const {isFOL, isEditable} = useSelector((state: GlobalState) => state.board)
    const dispatch = useDispatch();

    return (
        <button
            disabled={!isEditable}
            onClick={() => {dispatch(switchFOL());}}
            className={`danger-controls-btn ms-1 mt-1 ${!isEditable ? "danger-controls-locked" : ""}`}
            title={"Current language"}
        >
            {isFOL ? "FOL" : "PL"}
        </button>
    );
}

export function DangerControl({ zoomToElement }: { zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void }) {

    return (
        <div className="danger-controls p-0 list-unstyled d-flex flex-column align-items-center">
            {/*<SolverBtn zoomToElement={zoomToElement}/>*/}
            <HelperBtn/>
            <FeedbackLevelBtn/>
            {/*<LanguageBtn/>*/}
        </div>
    )
}