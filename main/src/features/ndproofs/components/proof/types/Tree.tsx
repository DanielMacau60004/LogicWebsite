import {ComponentType, ExpComponent, MarkComponent, RuleComponent, TreeComponent} from "../../../types/proofBoard";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import React from "react";
import {Draggable, DraggableRender} from "../../../../../components/Draggable";
import {Mark} from "./Mark";
import {Exp} from "./Exp";
import {Rule} from "./Rule";
import "../Types.scss"
import {FaClone, FaTrash} from "react-icons/fa";
import {CLONE_COMPONENT_ID, DELETE_COMPONENT_ID} from "../../../models/proofBoard";

export function Tree(tree: TreeComponent) {
    const {components, drag, active} = useSelector((state: GlobalState) => state.board)
    const {conclusion, hypotheses, rule, marks} = tree

    const {id, position} = tree

    const onRender: (args: DraggableRender) => {
        className?: string;
        style?: React.CSSProperties;
    } = (args) => {
        return {
            className: `${tree.className || ''} ${args.className || ''}`,
            style: {
                ...args.style,
                ...(active?.id === tree.id && {zIndex: 1000}),
                ...(args.draggable.active?.id === tree.id && {opacity: 100}),
                ...(args.draggable.isDragging && !tree.parent && drag && {opacity: 0}),
                transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`
            }
        };
    };


    return (
        <Draggable id={String(id)} className={`proof-component proof-tree ${tree.parent === undefined ? 'root' : ''}`}
                   onRender={onRender}>

            {active && active.id === tree.id && drag === undefined &&
                <div className={"proof-properties"}>
                    <button id={DELETE_COMPONENT_ID} className={"proof-component"}><FaTrash size={20} /></button>
                    <button id={CLONE_COMPONENT_ID} className={"proof-component"}><FaClone size={20} /></button>
                </div>
            }
            <table>
                <tbody>
                <tr>
                    <td className={"proof-hypothesis"}>
                        {hypotheses && hypotheses.map((number: any) => {
                            if (components[number].type === ComponentType.TREE)
                                return <Tree key={number} {...components[number] as TreeComponent} />;
                            else return <Exp key={number} exp={components[number] as ExpComponent}/>;
                        })}
                    </td>
                </tr>
                <tr>
                    <td>
                        <hr/>
                    </td>
                    <td><Rule rule={components[rule] as RuleComponent}/></td>
                    {marks && marks.map((mark: number, index) => (
                        <td key={index}><Mark mark={components[mark] as MarkComponent}/></td>
                    ))}
                </tr>
                <tr>
                    <td className={"proof-conclusion"}>
                        {conclusion && <Exp exp={components[conclusion] as ExpComponent}/>}
                    </td>
                </tr>
                </tbody>
            </table>
        </Draggable>
    );
}