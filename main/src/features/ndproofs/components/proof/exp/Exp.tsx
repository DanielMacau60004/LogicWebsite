import {useExp} from "./useExp";
import {Droppable} from "../../../../../components/Droppable";
import {ExpComponent, PreviewExpComponent} from "../../../types/proofBoard";
import React from "react";
import {Mark} from "../mark/Mark";
import "./Exp.scss"
import {ExpMenu} from "./ExpMenu";
import {ExpInput} from "./ExpInput";

export function Exp({exp}: { exp: ExpComponent }) {
    const {isSelected, value, show, hasMarkValue, markComponent, onRender } = useExp({exp});

    return (

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

    );
}

export function ExpPreview({exp}: { exp: PreviewExpComponent }) {
    return (
        <div className="proof-component proof-exp">
            <div className="proof-component-content">
                {exp.value}
            </div>
        </div>
    );
}