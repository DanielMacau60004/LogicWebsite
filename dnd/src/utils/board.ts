import {Component, EProof, Position} from "./components";

let id = 1;

export function mark(value? : string, position?: Position) {
    return {id: id++, type: EProof.MARK, value, position}
}

export function rule(value? : string, position?: Position) {
    return {id: id++, type: EProof.RULE, value, position}
}

export function exp(value? : string, position?: Position) {
    return {id: id++, type: EProof.EXP, value, position}
}

export function tree(conclusion: Component, rule: Component, hypotheses: Component[], marks?: Component[], position?: Position) {
    return {id: id++, type: EProof.TREE, conclusion, rule, hypotheses, marks, position}
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

export function appendComponents(componentsList: Component[]): {
    boardItems: { [key: number]: number },
    components: { [key: number]: Component }
} {
    const boardItems: { [key: number]: number } = {};
    const components: { [key: number]: Component } = {};

    componentsList.forEach((component: Component) => {
        const id = appendComponent(components, component);
        boardItems[id] = id;
    });
    return {boardItems, components}
}