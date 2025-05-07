import "./AdderControl.scss"
import {Button} from "react-bootstrap";
import {FaPlus} from "react-icons/fa";

import {useAddedControl} from "./useAddedControl";

function AdderBtn() {
    const {handleAdderClick} = useAddedControl()

    return (
        <Button className={"adder-controls-btn ms-2"} onMouseDown={handleAdderClick}>
            <FaPlus size={30}/>
        </Button>
    )
}

export function AdderControl() {

    return (
        <div className="adder-controls p-0 list-unstyled d-flex flex-row align-items-center">
            <AdderBtn />
        </div>
    )
}