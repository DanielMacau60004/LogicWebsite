import "./ToolsControl.scss"
import {Button} from "react-bootstrap";
import {FaPlus} from "react-icons/fa";

import {useToolsControl} from "./useToolsControl";
import {VscOutput} from "react-icons/vsc";
import { RiTreeLine } from "react-icons/ri";

import { TbHelp } from "react-icons/tb";
import { TbHelpOff } from "react-icons/tb";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {switchHelpMode} from "../../../../../store/boardSlice";
import { AiFillHome } from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import { RiTreeFill } from "react-icons/ri";
import { FaTree } from "react-icons/fa";

function HomeBtn() {
    const navigate = useNavigate();
    return (
        <Button className={"tools-controls-btn"}
                onClick={() => {navigate('/');}}>
            <AiFillHome   size={30}/>
        </Button>
    )
}

function AdderBtn({zoomToElement}: {
    zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void
}) {
    const {handleAdderClick} = useToolsControl(zoomToElement)

    return (
        <Button className={"tools-controls-btn mt-2"} onMouseDown={handleAdderClick}>
            <FaTree size={30}/>
        </Button>
    )
}

export function ToolsControl({ zoomToElement }: { zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void }) {

    return (
        <div className="tools-controls p-0 list-unstyled d-flex flex-column align-items-center">
            <HomeBtn/>
            <AdderBtn zoomToElement={zoomToElement}/>
        </div>
    )
}