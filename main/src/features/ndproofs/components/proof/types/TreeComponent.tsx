import {BoardComponent} from "../../../types/proofBoard";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {ProofComponent} from "../ProofComponent";
import React from "react";
import {Element} from "../ProofComponents";

export function TreeComponent(tree: BoardComponent) {
    const {components} = useSelector((state: GlobalState) => state.board)
    const {conclusion, hypotheses, rule, marks} = tree

    return (
        <ProofComponent {...tree} className={`proof-component proof-tree ${tree.className || ''}`}>
            <table>
                <tbody>
                <tr>
                    <td className={"proof-hypothesis"}>
                        {hypotheses && hypotheses.map((hypothesis: number) => (
                            <Element key={hypothesis} {...components[hypothesis]} />
                        ))}
                    </td>
                </tr>
                <tr>
                    <td>
                        <hr/>
                    </td>
                    <td><Element {...components[rule]}/></td>
                    {marks && marks.map((mark: number) => (
                        <td key={mark}>
                            <Element {...components[mark]} />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td className={"proof-conclusion"}>
                        {conclusion && <Element {...components[conclusion]}/>}
                    </td>
                </tr>
                </tbody>
            </table>
        </ProofComponent>
    );
}