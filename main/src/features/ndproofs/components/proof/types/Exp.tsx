import {useExp} from "../useExp";
import {Droppable, DroppableRender} from "../../../../../components/Droppable";
import {ExpComponent} from "../../../types/proofBoard";
import React from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {Components} from "../../../models/proofComponents";
import {deepCopy} from "../../../../../utils/general";

export function Exp({ exp }: { exp: ExpComponent }) {
    const {id, isSelected, ref, onBlur, onChange, value} = useExp({exp})
    const state = useSelector((state: GlobalState) => state.board);

    const onRender: (args: DroppableRender) => {
        className?: string;
        style?: React.CSSProperties;
    } = (args) => {

        return {
            className: args.className,
            style: {
                ...args.style,
                ...(Components.canDrop(state, state.active, exp) && { backgroundColor:"red" })
            }
        };
    };

    return (
        <Droppable id={id} className={`proof-component proof-exp`} onRender={onRender}>
            <div id={id} className={"proof-component-content"}>
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
                    : value
                }
            </div>
        </Droppable>
    );
}