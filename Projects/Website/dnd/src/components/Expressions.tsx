import React from 'react';
import {Object} from "./Object";
import {GlobalState} from "../store";
import {useSelector} from "react-redux";
import {Component} from "../store/board";

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
    const {components, boardItems} = useSelector((state: GlobalState) => state.board)

    return (
        <Object key={id} {...props} className="tree">
            <table>
                <tbody>
                <tr className="hypotheses">
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
                <tr className="conclusion">
                    <td>
                        {conclusion &&
                            <Element key={conclusion} {...components[conclusion]}/>}
                    </td>
                </tr>
                </tbody>
            </table>
        </Object>

    );
}

export function Element(props: Component) {
    switch (props.type) {
        case "exp" :
            return <Expression {...props}/>
        case "mark" :
            return <Mark {...props}/>
        case "rule" :
            return <Rule {...props} />
        case "tree" :
            return <Tree {...props} />
    }
}
