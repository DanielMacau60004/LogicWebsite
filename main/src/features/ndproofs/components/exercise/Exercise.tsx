import "./Exercise.scss"
import {TreeComponent} from "../../types/proofBoard";

import React from "react";
import "../proof/exp/Exp.scss"
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {Tree} from "../proof/tree/Tree";


export function Exercise() {
    const state = useSelector((state: GlobalState) => state.board);

    return (
        <div className="exercise p-0 list-unstyled d-flex flex-row align-items-center">
            <div className={"exercise-content"}>
                {state.exercise.map((premise: number, index) => (
                    <React.Fragment key={index}>
                        <Tree tree={state.components[premise] as TreeComponent}/>
                    </React.Fragment>
                ))}
            </div>
        </div>

    )
}