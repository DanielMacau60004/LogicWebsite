import {ComponentType, ExpComponent, MarkComponent, RuleComponent, TreeComponent} from "../../../types/proofBoard";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import React from "react";
import {Draggable, DraggableRender} from "../../../../../components/Draggable";
import {Mark} from "./Mark";
import {Exp} from "./Exp";
import {Rule} from "./Rule";
import "../ProofComponent.scss"

export function Tree(tree: TreeComponent) {
    const {components} = useSelector((state: GlobalState) => state.board)
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
                ...(args.draggable.active?.id === tree.id && { opacity: 100 }),
                //TODO fix this!!
                //TODO padding can be handled here!
                //...(args.draggable.isDragging && !tree.parent && { opacity: 0 }),
                transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`
            }
        };
    };

    return (
        <Draggable id={String(id)} className={`proof-component proof-tree`} onRender={onRender}>
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