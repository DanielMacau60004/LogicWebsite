import {
    ComponentType,
    Position,
    PreviewExpComponent,
    PreviewMarkComponent,
    PreviewRuleComponent,
    PreviewTreeComponent
} from "../../types/proofBoard";
import {RULE} from "../../types/proofRules";

//TODO remove mark from here
export function exp(value?: string, markNumber?: number): PreviewExpComponent {
    return {type: ComponentType.EXP, value: value, mark: mark(markNumber)};
}

export function treeExp(
    conclusion: PreviewExpComponent,
    position?: Position
): PreviewTreeComponent {
    return {type: ComponentType.TREE, conclusion, position};
}

export function rule(value?: RULE): PreviewRuleComponent {
    return {type: ComponentType.RULE, value: value};
}

export function mark(value?: number): PreviewMarkComponent {
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
