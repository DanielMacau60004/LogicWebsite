import React, {useEffect} from 'react';
import {Object} from "./Object";
import {GlobalState} from "../store";
import {useSelector} from "react-redux";
import {Component, EComponentTypes} from "../store/components";

export function Rule(props: Component) {
    return <Object {...props} className={'rule center-content'}> {props.value} </Object>
}

export function Mark(props: Component) {
    return <Object {...props} className={'mark center-content'}> {props.value} </Object>
}

export function Expression(props: Component) {
    return <Object {...props} className={'expression center-content'}> {props.value} </Object>
}

export function Tree(props: Component) {
    const {id, conclusion, hypotheses, rule, marks} = props
    const {components} = useSelector((state: GlobalState) => state.board)

    return (
        <Object key={id} {...props} className="tree">
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
        </Object>
    );
}

export function Element(props: Component) {
    switch (props.type) {
        case EComponentTypes.EXP :
            return <Expression {...props}/>
        case EComponentTypes.MARK :
            return <Mark {...props}/>
        case EComponentTypes.RULE :
            return <Rule {...props} />
        case EComponentTypes.TREE :
            return <Tree {...props} />
    }
}
