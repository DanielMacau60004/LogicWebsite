import {useExp, useExpPreview} from "./useExp";
import {Droppable} from "../../../../../components/Droppable";
import {ExpComponent, PreviewExpComponent} from "../../../types/proofBoard";
import React from "react";
import {Mark, MarkPreview} from "../mark/Mark";
import "./Exp.scss"
import {ExpMenu} from "./ExpMenu";
import {ExpInput} from "./ExpInput";
import ErrorTooltip from "../../others/ErrorTooltip";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {FeedbackLevel} from "../../../types/feedback";
import {HintTooltip} from "../../others/HintTooltip";

export function Exp({exp}: { exp: ExpComponent }) {
    const state = useSelector((state: GlobalState) => state.board);
    const {isSelected, value, show, hasMarkValue, markComponent, onRender} = useExp({exp});
    const hasErrors = !!Object.keys(exp.errors || {}).length;


    return (
        <>
            <div className="exp-help">

            {hasErrors && state.feedbackLevel !== FeedbackLevel.None && <ErrorTooltip errors={exp.errors}/>}
            {exp.genHints !== undefined && state.feedbackLevel !== FeedbackLevel.None && exp.genHints &&
                <HintTooltip exp={exp}/>}
            </div>

            <Droppable id={String(exp.id)} className="proof-component proof-exp" onRender={onRender}>
                <ExpMenu show={show} markComponent={markComponent}/>


                <div className="proof-component-content">
                    {isSelected ? (
                        <ExpInput exp={exp}/>
                    ) : (value)}
                </div>

                {hasMarkValue && markComponent && (
                    <div className="mark-adder">
                        <Mark mark={markComponent}/>
                    </div>
                )}
            </Droppable>
        </>
    );
}

export function ExpPreview({exp}: { exp: PreviewExpComponent }) {
    const {value, hasMarkValue, markComponent} = useExpPreview({exp});

    return (
        <div className={"proof-component"}>
            {exp.markFormula &&
                <div className={"exp-markFormula"} dangerouslySetInnerHTML={{__html: exp.markFormula}}/>}
            {exp.subTree && <div className={"exp-subTree"} dangerouslySetInnerHTML={{__html: exp.subTree}}/>}
            <div className="proof-exp">
                <div className="proof-component-content preview">

                    <div dangerouslySetInnerHTML={{__html: value ?? ""}}/>
                </div>

                {hasMarkValue && markComponent && (
                    <div className="mark-adder">
                        <MarkPreview mark={markComponent}/>
                    </div>
                )}
            </div>
        </div>
    );
}