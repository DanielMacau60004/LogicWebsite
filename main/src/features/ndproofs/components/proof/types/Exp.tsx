import {useExp} from "../useExp";
import {Droppable, DroppableRender} from "../../../../../components/Droppable";
import {ComponentType, ExpComponent, MarkComponent} from "../../../types/proofBoard";
import React from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {Components} from "../../../models/proofComponents";
import {Mark} from "./Mark";
import {Rule} from "./Rule";
import {APPEND_MARK_COMPONENT_ID, APPEND_RULE_COMPONENT_ID} from "../../../models/proofBoard";
import {deepCopy} from "../../../../../utils/general";

export function Exp({exp}: { exp: ExpComponent }) {
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

    /*const show = state.active && state.active.id === Components.getLastParent(state, exp).id
        && Components.isLeaf(state, exp) && state.drag === undefined*/
    const show = state.drag === undefined && Components.isLeaf(state, exp) &&
        ((state.active !== undefined && state.active.id === exp.id)
        || (state.editing && exp.mark && state.editing.id === exp.mark)) &&
        (exp.mark === undefined || state.components[exp.mark].value === undefined)

    return (

        <Droppable id={String(exp.id)} className={`proof-component proof-exp`} onRender={onRender}>
            {show && <>
                <div className={`rule-adder`}>
                    <Rule rule={{id: APPEND_RULE_COMPONENT_ID, type: ComponentType.RULE}}/>
                </div>
                <div className={`mark-adder`}>
                    {exp.mark && <Mark mark={state.components[exp.mark] as MarkComponent}/>}
                </div>
            </>
            }
            {exp.mark && state.components[exp.mark].value &&
                <div className={`mark-adder`}>
                    <Mark mark={state.components[exp.mark] as MarkComponent}/>
                </div>
            }

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
                    : value
                }
            </div>
        </Droppable>

    );
}