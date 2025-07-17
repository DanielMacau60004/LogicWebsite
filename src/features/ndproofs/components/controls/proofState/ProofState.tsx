import "./ProofState.scss"
import React from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {TreeComponent} from "../../../types/proofBoard";
import {Tree} from "../../proof/tree/Tree";

export function ProofState() {
    const state = useSelector((state: GlobalState) => state.board);

    if (!state.active || !state.currentProof)
        return <></>

    const {premises, conclusion, hypotheses} = state.currentProof

    return (
        <div className="proof-state">
            <div className={"proof-state-content"}>

                {premises && premises.length > 0 && (
                    <div className={"content"}>
                        <h5>Premises</h5>

                        {Object.entries(premises).map(([key, value]) => (
                            <Tree key={key} tree={state.components[value] as TreeComponent}/>
                        ))}
                    </div>

                )}

                {conclusion && (
                    <div className={"content"}>
                        <h5>Conclusion</h5>
                        <Tree tree={state.components[conclusion] as TreeComponent}/>
                    </div>
                )}

                {hypotheses && hypotheses.length > 0 && (
                    <div className={"content"}>
                        <h5>Hypotheses</h5>

                        {Object.entries(hypotheses).map(([key, value]) => (
                            <Tree key={key} tree={state.components[value] as TreeComponent}/>
                        ))}
                    </div>

                )}

            </div>
        </div>

    )
}