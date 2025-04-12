import {Component, EProof, Position} from "./components";
import {boardComponents} from "./init/boardInit";

let id = 1;
export const components: { [key: number]: Component } = {};

export function getNextID(): number {
    return id++
}

export function mark(value?: string, position?: Position): Component {
    return {id: getNextID(), type: EProof.MARK, value, position};
}

export function markC(value?: string): Component {
    const cloneableMark = {...mark(value), cloneable: true}
    return components[cloneableMark.id] = cloneableMark
}

export function rule(value?: string, position?: Position): Component {
    return {id: getNextID(), type: EProof.RULE, value, position};
}

export function ruleC(value?: string): Component {
    const cloneableRule = {...rule(value), cloneable: true}
    return components[cloneableRule.id] = cloneableRule
}

export function exp(value?: string, position?: Position): Component {
    return {id: getNextID(),type: EProof.EXP, value, position};
}

export function expC(value?: string): Component {
    const cloneableExp = {...exp(value), cloneable: true}
    return components[cloneableExp.id] = cloneableExp
}

export function tree(conclusion: Component, rule: Component, hypotheses: Component[], marks?: Component[],
                     position?: Position): Component {
    return {id: getNextID(), type: EProof.TREE, conclusion, rule, hypotheses, marks, position};
}

export function treeC(conclusion: Component, rule: Component, hypotheses: Component[], marks?: Component[]): Component {
    const cloneableTree = {...tree(conclusion, rule, hypotheses, marks), cloneable: true}
    return components[cloneableTree.id] = cloneableTree
}

function appendComponent(components: {
    [key: number]: Component
}, component: Component, parent?: number): number {

    const id = component.id;
    switch (component.type) {
        case EProof.TREE:
            const conclusion = appendComponent(components, component.conclusion, id)
            const rule = appendComponent(components, component.rule, id)
            const hypotheses = component.hypotheses.map((hypothesis: any) =>
                appendComponent(components, hypothesis, id));
            const marks = component.marks?.map((mark: any) =>
                appendComponent(components, mark, id));

            components[id] = {id, type: EProof.TREE, parent, position: component.position, conclusion, rule, hypotheses, marks}
            break;
        default:
            component.parent = parent
            components[id] = component
            break;
    }
    return id;
}

export function loadComponents(): {
    boardItems: { [key: number]: number };
    components: { [key: number]: Component };
} {
    const boardItems: { [key: number]: number } = {}
    boardComponents().forEach(component =>
        boardItems[component.id] = appendComponent(components, component)
    );

    console.log(boardItems, components)
    return {boardItems, components}
}

