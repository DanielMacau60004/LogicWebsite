import {
    ComponentType,
    ExpComponent,
    MarkComponent,
    PreviewExpComponent,
    PreviewMarkComponent,
    PreviewRuleComponent,
    PreviewTreeComponent,
    RuleComponent,
    TreeComponent
} from "../../../types/proofBoard";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import React from "react";
import {Draggable} from "../../../../../components/Draggable";
import "./Tree.scss"
import {TreeMenu} from "./TreeMenu";
import {Exp, ExpPreview} from "../exp/Exp";
import {Rule, RulePreview} from "../rule/Rule";
import {Mark, MarkPreview} from "../mark/Mark";
import {useTreeState} from "./useTreeState";
import {RuleHelper} from "../../controls/helper/RuleHelper";

export function Tree({tree}: { tree: TreeComponent }) {
    const {drag, isRoot, isSelected, onRender} = useTreeState(tree);

    return (
        <Draggable
            id={String(tree.id)}
            className={`proof-component proof-tree ${isRoot ? "root" : ""}`}
            onRender={onRender}
        >
            {isSelected && !drag && <TreeMenu/>}
            <TreeContent tree={tree}/>
        </Draggable>
    );
}

function TreeContent({tree}: { tree: TreeComponent }) {
    return (
        <table>
            <tbody>
            {tree.hypotheses && <TreeChildren tree={tree}/>}
            {(tree.rule && tree.marks) && <TreeRuleRow tree={tree}/>}
            {tree.conclusion && <TreeConclusionRow tree={tree}/>}
            </tbody>
        </table>
    );
}

function TreeChildren({tree}: { tree: TreeComponent }) {
    const {components} = useSelector((state: GlobalState) => state.board);

    return (
        <tr>
            <td className="proof-hypothesis">
                {tree.hypotheses!!.map(id => {
                    const comp = components[id];
                    return comp.type === ComponentType.TREE
                        ? <Tree key={id} tree={comp as TreeComponent}/>
                        : <Exp key={id} exp={comp as ExpComponent}/>;
                })}
            </td>
        </tr>
    );
}

function TreeRuleRow({tree}: { tree: TreeComponent }) {
    const {components} = useSelector((state: GlobalState) => state.board);
    return (
        <tr>
            <td>
                <hr/>
            </td>
            <td>
                <Rule rule={components[tree.rule!!] as RuleComponent}/>
            </td>
            {tree.marks!!.map((id, index) => (
                <td key={index}>
                    <Mark mark={components[id] as MarkComponent}/>
                </td>
            ))}
            <td><RuleHelper rule={components[tree.rule!!].value}/></td>
        </tr>
    );
}

function TreeConclusionRow({tree}: { tree: TreeComponent }) {
    const {components} = useSelector((state: GlobalState) => state.board);
    return (
        <tr>
            <td className="proof-conclusion">
                <Exp exp={components[tree.conclusion] as ExpComponent}/>
            </td>
        </tr>
    );
}


export function TreePreview({tree}: { tree: PreviewTreeComponent }) {

    return (
        <div className={`proof-component proof-tree`}>
            <TreePreviewContent tree={tree}/>
        </div>
    );
}

function TreePreviewContent({tree}: { tree: PreviewTreeComponent }) {
    return (
        <table>
            <tbody>
            {tree.hypotheses && <TreePreviewChildren tree={tree}/>}
            {(tree.rule || tree.marks) && <TreePreviewRuleRow tree={tree}/>}
            {tree.conclusion && <TreePreviewConclusionRow tree={tree}/>}
            </tbody>
        </table>
    );
}

function TreePreviewChildren({tree}: { tree: PreviewTreeComponent }) {
    return (
        <tr>
            <td className="proof-hypothesis">
                {tree.hypotheses!!.map((hypothesis, index) => {
                    return hypothesis.type === ComponentType.TREE
                        ? <TreePreview key={index} tree={hypothesis as PreviewTreeComponent}/>
                        : <ExpPreview key={index} exp={hypothesis as PreviewExpComponent}/>;
                })}
            </td>
        </tr>
    );
}

function TreePreviewRuleRow({tree}: { tree: PreviewTreeComponent }) {

    return (
        <tr>
            <td>
                <hr/>
            </td>
            <td>
                <RulePreview rule={tree.rule!! as PreviewRuleComponent}/>
            </td>
            {tree.marks && tree.marks.map((mark, index) => (
                <td key={index}>
                    <MarkPreview mark={mark as PreviewMarkComponent}/>
                </td>
            ))}
        </tr>
    );
}

function TreePreviewConclusionRow({tree}: { tree: PreviewTreeComponent }) {
    return (
        <tr>
            <td className="proof-conclusion">
                <ExpPreview exp={tree.conclusion as PreviewExpComponent}/>
            </td>
        </tr>
    );
}
