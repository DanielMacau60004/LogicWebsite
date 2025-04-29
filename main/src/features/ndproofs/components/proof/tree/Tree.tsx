import {ComponentType, ExpComponent, MarkComponent, RuleComponent, TreeComponent} from "../../../types/proofBoard";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import React from "react";
import {Draggable} from "../../../../../components/Draggable";
import "./Tree.scss"
import {TreeMenu} from "./TreeMenu";
import {Exp} from "../exp/Exp";
import {Rule} from "../rule/Rule";
import {Mark} from "../mark/Mark";
import {useTreeState} from "./useTreeState";

export function Tree({tree}: {tree: TreeComponent}) {
    const {drag, isRoot, isSelected, onRender } = useTreeState(tree);

    return (
        <Draggable
            id={String(tree.id)}
            className={`proof-component proof-tree ${isRoot ? "root" : ""}`}
            onRender={onRender}
        >
            {isSelected && !drag && <TreeMenu />}
            <TreeContent tree={tree} />
        </Draggable>
    );
}

function TreeContent({ tree }: { tree: TreeComponent }) {
    return (
        <table>
            <tbody>
            {tree.hypotheses && <TreeChildren tree={tree} />}
            {(tree.rule && tree.marks) && <TreeRuleRow tree={tree} />}
            {tree.conclusion && <TreeConclusionRow tree={tree} />}
            </tbody>
        </table>
    );
}

function TreeChildren({ tree }: { tree: TreeComponent }) {
    const { components } = useSelector((state: GlobalState) => state.board);

    return (
        <tr>
            <td className="proof-hypothesis">
                {tree.hypotheses!!.map(id => {
                    const comp = components[id];
                    return comp.type === ComponentType.TREE
                        ? <Tree key={id} tree={comp as TreeComponent} />
                        : <Exp key={id} exp={comp as ExpComponent} />;
                })}
            </td>
        </tr>
    );
}

function TreeRuleRow({ tree }: { tree: TreeComponent }) {
    const { components } = useSelector((state: GlobalState) => state.board);
    return (
        <tr>
            <td><hr /></td>
            <td><Rule rule={components[tree.rule!!] as RuleComponent} /></td>
            {tree.marks!!.map((id, index) => (
                <td key={index}>
                    <Mark mark={components[id] as MarkComponent} />
                </td>
            ))}
        </tr>
    );
}

function TreeConclusionRow({ tree }: { tree: TreeComponent }) {
    const { components } = useSelector((state: GlobalState) => state.board);
    return (
        <tr>
            <td className="proof-conclusion">
                <Exp exp={components[tree.conclusion] as ExpComponent} />
            </td>
        </tr>
    );
}