import React from "react";
import {MarkComponent, PreviewMarkComponent} from "../../../types/proofBoard";
import {useMark, useMarkPreview} from "./useMark";
import "./Mark.scss"

export function Mark({mark}: { mark: MarkComponent }) {
    const {id, ref, value, className, style, onBlur} = useMark({mark})
    return (
        <div id={id} ref={ref} onBlur={onBlur} tabIndex={0} className={`proof-component proof-mark ${className}`}
        style={style}>
            <div className={"proof-component-content"}>
                {value}
            </div>
        </div>
    )
}

export function MarkPreview({mark}: { mark: PreviewMarkComponent }) {
    const {value, style} = useMarkPreview({mark})

    return (
        <div className={`proof-component proof-mark`} style={style}>
            <div className={"proof-component-content"}>
                <div dangerouslySetInnerHTML={{ __html: value }} />
            </div>
        </div>
    )
}