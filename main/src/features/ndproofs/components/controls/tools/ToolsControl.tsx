import "./ToolsControl.scss"
import {Button} from "react-bootstrap";
import {FaPlus} from "react-icons/fa";

import {useToolsControl} from "./useToolsControl";
import {VscOutput} from "react-icons/vsc";

function AdderBtn({zoomToElement}: {
    zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void
}) {
    const {handleAdderClick} = useToolsControl(zoomToElement)

    return (
        <Button className={"tools-controls-btn ms-2"} onMouseDown={handleAdderClick}>
            <FaPlus size={30}/>
        </Button>
    )
}

function SolverBtn({zoomToElement}: {
    zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void
}) {
    const {handleSolverClick} = useToolsControl(zoomToElement)

    return (
        <Button className={"tools-controls-btn ms-2 mt-2"} onMouseDown={handleSolverClick}>
            <VscOutput size={30}/>
        </Button>
    )
}

export function ToolsControl({ zoomToElement }: { zoomToElement: (selector: string, scale?: number, transitionTime?: number) => void }) {

    return (
        <div className="tools-controls p-0 list-unstyled d-flex flex-column align-items-center">
            <AdderBtn zoomToElement={zoomToElement}/>
            <SolverBtn zoomToElement={zoomToElement}/>
        </div>
    )
}