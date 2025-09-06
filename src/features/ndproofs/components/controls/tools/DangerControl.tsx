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
    const {handleSolverClick} = useToolsControl(zoomToElement)

    return (
        <Button className={"danger-controls-btn ms-1 mt-1"} onMouseDown={handleSolverClick} title="Solve exercise">
            <VscOutput size={25}/>
        </Button>
    )
}

function HelperBtn() {
    const isHelpMode = useSelector((state: GlobalState) => state.board.isHelpMode);
    const dispatch = useDispatch();

    return (
        <Button className={"danger-controls-btn ms-1 mt-1"}
        onClick={()=>{
            dispatch(switchHelpMode())
        }} title={isHelpMode ? "Show rules tooltip" : "Hide rules tooltip"}>

            {isHelpMode && <TbHelp  size={25}/>}
            {!isHelpMode && <TbHelpOff  size={25}/>}
        </Button>
    )
}

function FeedbackLevelBtn() {
    const feedbackLevel = useSelector((state: GlobalState) => state.board.feedbackLevel);
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => {dispatch(switchFeedbackLevel());}}
            className="danger-controls-btn ms-1 mt-1"
            title={feedbackLevel}
        >
            {"❙".repeat(feedbackLevels.indexOf(feedbackLevel)+1)}
        </button>
    );
}

function LanguageBtn() {
    const isFOL = useSelector((state: GlobalState) => state.board.isFOL);
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => {dispatch(switchFOL());}}
            className="danger-controls-btn ms-1 mt-1"
            title={"Current language"}
        >
            {isFOL ? "FOL" : "PL"}
        </button>
    );
}

export function DangerControl({ zoomToElement }: { zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void }) {

    return (
        <div className="danger-controls p-0 list-unstyled d-flex flex-column align-items-center">
            <SolverBtn zoomToElement={zoomToElement}/>
            <HelperBtn/>
            <FeedbackLevelBtn/>
            <LanguageBtn/>
        </div>
    )
}