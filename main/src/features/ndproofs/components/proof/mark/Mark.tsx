import React from "react";
import {MarkComponent} from "../../../types/proofBoard";
import {useMark} from "./useMark";
import "./Mark.scss"

export function Mark({mark}: { mark: MarkComponent }) {
    const {id, ref, value, onBlur} = useMark({mark})
    return (
        <div id={id} ref={ref} onBlur={onBlur} tabIndex={0} className={`proof-component proof-mark`}>
            <div className={"proof-component-content"}>
                {value}
            </div>
        </div>
    )
}
