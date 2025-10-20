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
import {FaQuestion} from "react-icons/fa";
import ErrorTooltip from "../../others/ErrorTooltip";
import {FeedbackLevel} from "../../../types/feedback";
import {deepCopy} from "../../../../../utils/general";
import {Boards} from "../../../models/board/logic";

export function Tree({tree}: { tree: TreeComponent }) {
    const {drag, isRoot, isSelected, shouldCompareConclusion, hasErrors, onRender} = useTreeState(tree);

    return (
        <Draggable
            id={String(tree.id)}
            className={`proof-component proof-tree ${isRoot ? "root" : ""} ${tree.hasErrors ? "error" : ""}`}
            onRender={onRender}
        >
            {isSelected && !drag && <TreeMenu hasErrors={tree.hasErrors || hasErrors} isValid={tree.isValid && !tree.hasErrors}
                                             isBeingSubmitted={tree.isBeingSubmitted}
                                              shouldCompareConclusion={shouldCompareConclusion} solveCurrentExercise={tree.solveExercise}/>}
            <TreeContent tree={tree}/>
        </Draggable>
    );
}

function TreeContent({tree}: { tree: TreeComponent }) {
    const {drag} = useSelector((state: GlobalState) => state.board);
    return (
        <table className="tree-table">
            <tbody>
            {tree.hypotheses && <TreeChildren tree={tree}/>}
            {(tree.rule && tree.marks) && <TreeRuleRow tree={tree}/>}
            {tree.conclusion && <TreeConclusionRow tree={tree}/>}
            </tbody>
        </table>
    );
}

function StateTreeChildren({tree}: { tree: TreeComponent }) {
    const state = useSelector((state: GlobalState) => state.board);
    const hasErrors = !!Object.keys(tree.errors || {}).length;

    return (
        <>
            {hasErrors && state.feedbackLevel !== FeedbackLevel.None && <ErrorTooltip errors={tree.errors}/>}
        </>
    )
}

function TreeChildren({tree}: { tree: TreeComponent }) {
    const {components} = useSelector((state: GlobalState) => state.board);

    return (
        <tr>
            <td></td>
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
    const {drag, components, isHelpMode, editing} = useSelector((state: GlobalState) => state.board);
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    return (
        <tr className="proof-rules">
            <td>
                {<StateTreeChildren tree={tree}/>}
            </td>
            <td>
                <hr/>
            </td>
            <td>
                {
                    !isTouchDevice && isHelpMode? (
                        <RuleHelper rule={components[tree.rule!!].value} show={500}>
                            <Rule rule={components[tree.rule!!] as RuleComponent} />
                        </RuleHelper>
                    ) : (
                        <Rule rule={components[tree.rule!!] as RuleComponent} />
                    )
                }

            </td>
            {tree.marks!!.map((id, index) => (
                <td key={index}>
                    <Mark mark={components[id] as MarkComponent}/>
                </td>
            ))}
            {
                isTouchDevice && isHelpMode && <td>
                    <RuleHelper rule={components[tree.rule!!].value}>
                        <div className={"rule-helper"}>
                            <FaQuestion/>
                        </div>
                    </RuleHelper>
                </td>
            }
        </tr>
    );
}

function TreeConclusionRow({tree}: { tree: TreeComponent }) {
    const {components} = useSelector((state: GlobalState) => state.board);

    return (
        <tr>
            <td></td>
            <td className="proof-conclusion">
                <Exp exp={components[tree.conclusion] as ExpComponent}/>
            </td>

        </tr>
    );
}


export function TreePreview({
                                tree
                            }: {
    tree: PreviewTreeComponent
}) {
    return (
        <div className={`proof-component proof-tree`}>
            <TreePreviewContent tree={tree}/>
        </div>
    );
}

function TreePreviewContent({
                                tree
                            }: {
    tree: PreviewTreeComponent
}) {
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

function TreePreviewChildren({
                                 tree
                             }: {
    tree: PreviewTreeComponent
}) {
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

function TreePreviewRuleRow({
                                tree
                            }: {
    tree: PreviewTreeComponent
}) {

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

function TreePreviewConclusionRow({
                                      tree
                                  }: {
    tree: PreviewTreeComponent
}) {
    return (
        <tr>
            <td className="proof-conclusion">
                <ExpPreview exp={tree.conclusion as PreviewExpComponent}/>
            </td>
        </tr>
    );
}
