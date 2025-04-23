import React from "react";
import {MarkComponent} from "../../../types/proofBoard";
import {useMark} from "../useMark";

export function Mark({ mark }: { mark: MarkComponent }) {
    const {id, ref, onBlur} = useMark({mark})
    return (
        <div id={id} ref={ref} onBlur={onBlur} tabIndex={0}
             className={`proof-component proof-mark`}>
            <div className={"proof-component-content"}>
                {mark.value}
            </div>
        </div>
    )
}
