import {
    ComponentType,
    Position,
    PreviewExpComponent,
    PreviewMarkComponent,
    PreviewRuleComponent,
    PreviewTreeComponent
} from "../../types/proofBoard";
import {RULE} from "../../types/proofRules";

export function expSidebar(value: string, markNumber?: any): PreviewTreeComponent {
    return {type: ComponentType.TREE, conclusion: {...exp(value, markNumber), editable: false}, editable: false,
        clone: treeExp(exp(value, markNumber))};
}

export function exp(value?: string, markNumber?: any, props?: { [key: string]: any }): PreviewExpComponent;
export function exp(value?: string, props?: { [key: string]: any }): PreviewExpComponent;
export function exp(
    value?: string, arg2?: any | { [key: string]: any }, arg3: { [key: string]: any } = {}): PreviewExpComponent {
    if (arg2 === undefined || typeof arg2 === 'number' || typeof arg2 === 'string')
        return {type: ComponentType.EXP, value: value, mark: mark(arg2), ...arg3,};
    else
        return {type: ComponentType.EXP, value: value, ...(arg2 || {}),};
}

export function treeExp(
    conclusion: PreviewExpComponent,
    position?: Position,
): PreviewTreeComponent {
    return {type: ComponentType.TREE, conclusion, position};
}

export function rule(value?: RULE): PreviewRuleComponent {
    return {type: ComponentType.RULE, value: value};
}

export function mark(value?: any): PreviewMarkComponent {
    return {type: ComponentType.MARK, value: value};
}

export function tree(
    conclusion: PreviewExpComponent,
    rule?: PreviewRuleComponent,
    hypotheses?: (PreviewExpComponent | PreviewTreeComponent)[],
    marks?: PreviewMarkComponent[],
    position?: Position
): PreviewTreeComponent {
    return {type: ComponentType.TREE, conclusion, rule, hypotheses, marks, position};
}
