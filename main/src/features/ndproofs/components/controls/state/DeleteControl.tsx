import {Droppable} from "../../../../../components/Droppable";
import "./DeleteControl.scss"
import {useDeleteControl} from "./useDeleteControl";

export function DeleteControl() {
    const {onRender} = useDeleteControl()

    return (
        <div className="delete-control">
            <Droppable id={"delete"} className={"trash-box"} onRender={onRender}>
                <span className="trash">
                    <span className="trash-lid"></span>
                    <i></i>
                </span>
            </Droppable>
        </div>
    );

}