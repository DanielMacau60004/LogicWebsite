import "./ToolsControl.scss"
import {Button} from "react-bootstrap";
import {FaTree} from "react-icons/fa";

import {useToolsControl} from "./useToolsControl";
import {AiFillHome} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

function HomeBtn() {
    const navigate = useNavigate();
    return (
        <Button className={"tools-controls-btn"}
                onClick={() => {
                    navigate('/');
                }} title="Back to Home">
            <AiFillHome size={20}/>
        </Button>
    )
}

function AdderBtn({zoomToElement}: {
    zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void
}) {
    const {handleAdderClick} = useToolsControl(zoomToElement)

    return (
        <Button className={"tools-controls-btn px-5"} onMouseDown={handleAdderClick} title="Add a new proof">
            <IoMdAdd size={25}/>
        </Button>
    )
}

export function ToolsControl({zoomToElement}: {
    zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void
}) {

    return (
        <>
            <div className="tools-controls p-0 list-unstyled d-flex flex-column align-items-center">
                <HomeBtn/>

            </div>
            <div className="tools-controls-bottom p-0 list-unstyled d-flex flex-row align-items-center">

                <AdderBtn zoomToElement={zoomToElement}/>
            </div>
        </>
    )
}