import React from "react";
import {MarkComponent, PreviewMarkComponent} from "../../../types/proofBoard";
import {useMark} from "./useMark";
import "./Mark.scss"

export function Mark({mark}: { mark: MarkComponent }) {
    const {id, ref, value, className, onBlur} = useMark({mark})
    return (
        <div id={id} ref={ref} onBlur={onBlur} tabIndex={0} className={`proof-component proof-mark ${className}`}>
            <div className={"proof-component-content"}>
                {value}
            </div>
        </div>
    )
}

export function MarkPreview({mark}: { mark: PreviewMarkComponent }) {
    return (
        <div className={`proof-component proof-mark`}>
            <div className={"proof-component-content"}>
                {mark.value}
            </div>
        </div>
    )
}