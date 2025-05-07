import "./Exercise.scss"
import {TreeComponent} from "../../types/proofBoard";

import React, {useRef} from "react";
import "../proof/exp/Exp.scss"
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {Tree} from "../proof/tree/Tree";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

function TurnstileIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 100 100" className="proof-consequence">
            <line x1="10" y1="20" x2="10" y2="80" stroke="currentColor" strokeWidth="14"/>
            <line x1="10" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="14"/>
        </svg>
    );
}

export function Exercise() {
    const state = useSelector((state: GlobalState) => state.board);

    return (
        <div className="exercise p-0 list-unstyled d-flex flex-row align-items-center">
            <div className={"exercise-content"}>
                {state.exercise.map((premise: number, index) => {
                    const isLast = index === state.exercise.length - 1;

                    return (
                        <React.Fragment key={index}>
                            {isLast && <TurnstileIcon/>}
                                <Tree tree={state.components[premise] as TreeComponent}/>
                        </React.Fragment>
                    );
                })}

            </div>
        </div>

    )
}