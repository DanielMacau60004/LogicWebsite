import {Droppable} from "../../../../../components/Droppable";
import "./DeleteControl.scss"
import {useDeleteControl} from "./useDeleteControl";
import {DELETE_COMPONENT_ID} from "../../../models/proofBoard";

export function DeleteControl() {
    const {onRender} = useDeleteControl()

    return (
        <div className="delete-control">
            <Droppable id={DELETE_COMPONENT_ID} className={"trash-box"} onRender={onRender}>
                <span className="trash">
                    <span className="trash-lid"></span>
                    <i></i>
                </span>
            </Droppable>
        </div>
    );

}