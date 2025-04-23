import {useExp} from "../useExp";
import {Droppable, DroppableRender} from "../../../../../components/Droppable";
import {ExpComponent} from "../../../types/proofBoard";
import React from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {Components} from "../../../models/proofComponents";
import {deepCopy} from "../../../../../utils/general";
import { MathJax, MathJaxContext } from "better-react-mathjax";

export function Exp({ exp }: { exp: ExpComponent }) {
    const {id, isSelected, ref, onBlur, onChange, value} = useExp({exp})
    const state = useSelector((state: GlobalState) => state.board);

    const onRender: (args: DroppableRender) => {
        className?: string;
        style?: React.CSSProperties;
    } = (args) => {

        const canDrag = Components.canDrop(state, state.active, exp) || (state.active && state.active.id === exp.id)
        const className = [
            args.className,
            canDrag ? "highlight" : "",
            canDrag && args.droppable.isOver ? "highlight-hover" : ""
        ].join(" ").trim();

        return {
            className: className,
            style: args.style
        };
    };


    return (

        <Droppable id={String(exp.id)} className={`proof-component proof-exp`} onRender={onRender}>
            <div className={"proof-component-content"}>
                {isSelected ?
                    <input
                        id={"input-expression"}
                        ref={ref}
                        type="text"
                        size={value ? value.length + 2 : 2}
                        onBlur={onBlur}
                        value={value}
                        onChange={onChange}
                        className="proof-exp-input"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        aria-autocomplete="none"
                        maxLength={50}
                    />
                    :  value
                }
            </div>
        </Droppable>
    );
}