import React from "react";
import {MarkComponent} from "../../../types/proofBoard";

export function Mark({ mark }: { mark: MarkComponent }) {
    return (
        <div id={String(mark.id)} className={`proof-component proof-mark`}>
            {mark.value}
        </div>
    )
}
