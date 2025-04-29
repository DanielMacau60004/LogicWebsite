import {useExp} from "./useExp";
import {Droppable} from "../../../../../components/Droppable";
import {ExpComponent} from "../../../types/proofBoard";
import React from "react";
import {Mark} from "../mark/Mark";
import "./Exp.scss"
import {ExpMenu} from "./ExpMenu";
import {ExpInput} from "./ExpInput";

export function Exp({exp}: { exp: ExpComponent }) {
    const {show, hasMarkValue, markComponent, onRender } = useExp({exp});

    return (
        <Droppable id={String(exp.id)} className="proof-component proof-exp" onRender={onRender}>
            <ExpMenu show={show} markComponent={markComponent} />
            <ExpInput exp={exp}/>
            {hasMarkValue && markComponent && (
                <div className="mark-adder">
                    <Mark mark={markComponent} />
                </div>
            )}
        </Droppable>

    );
}