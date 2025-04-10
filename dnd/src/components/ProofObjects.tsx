import React from 'react';
import {ProofObject} from "./ProofObject";
import {GlobalState} from "../store";
import {useSelector} from "react-redux";
import {Component, EProof} from "../utils/components";

export function Rule(props: Component) {
    return <ProofObject {...props} className={'rule center-content'}> {props.value} </ProofObject>
}

export function Mark(props: Component) {
    return <ProofObject {...props} className={'mark center-content'}> {props.value} </ProofObject>
}

export function Expression(props: Component) {
    return <ProofObject {...props} className={'expression center-content'}> {props.value} </ProofObject>
}

export function Tree(props: Component) {
    const {id, conclusion, hypotheses, rule, marks} = props
    const {components} = useSelector((state: GlobalState) => state.board)

    return (
        <ProofObject key={id} {...props} className={"tree"}>
            <table>
                <tbody>
                <tr>
                    <td>
                        {hypotheses && hypotheses.map((hypothesis: number) =>
                            (<Element key={hypothesis} {...components[hypothesis]} />))}
                    </td>
                </tr>
                <tr>
                    <td>
                        <hr/>
                    </td>
                    <td><Rule key={rule} {...components[rule]}/></td>
                    {marks && marks.map((mark: number) =>
                        (<td key={mark}><Mark{...components[mark]}/></td>))}
                </tr>
                <tr>
                    <td>
                        {conclusion && <Element key={conclusion} {...components[conclusion]}/>}
                    </td>
                </tr>
                </tbody>
            </table>
        </ProofObject>
    );
}

export function Element(props: Component) {
    switch (props.type) {
        case EProof.EXP :
            return <Expression {...props}/>
        case EProof.MARK :
            return <Mark {...props}/>
        case EProof.RULE :
            return <Rule {...props} />
        case EProof.TREE :
            return <Tree {...props} />
    }
}
