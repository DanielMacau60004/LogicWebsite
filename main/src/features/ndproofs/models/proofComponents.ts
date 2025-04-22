import {
    Board,
    Component,
    ComponentType,
    ExpComponent,
    MarkComponent,
    Position,
    PreviewExpComponent,
    PreviewMarkComponent,
    PreviewRuleComponent,
    RuleComponent,
    TreePreviewComponent
} from "../types/proofBoard";

export function createPreviewExp(value?: string): PreviewExpComponent {
    return {type: ComponentType.EXP, value: value};
}

export function createPreviewRule(value?: string): PreviewRuleComponent {
    return {type: ComponentType.RULE, value: value};
}

export function createPreviewMark(value?: number): PreviewMarkComponent {
    return {type: ComponentType.MARK, value: value};
}

export function createPreviewTree(
    conclusion: PreviewExpComponent,
    rule: PreviewRuleComponent,
    hypotheses: (PreviewExpComponent | TreePreviewComponent)[],
    marks: PreviewMarkComponent[],
    position?: Position
): TreePreviewComponent {
    return {type: ComponentType.TREE, conclusion, rule, hypotheses, marks, position};
}

export function createExp(id: number, value?: string, parent?: number): ExpComponent {
    return {id: id, type: ComponentType.EXP, value: value ? value : " ", parent};
}

export function createRule(id: number, value?: string, parent?: number): RuleComponent {
    return {id: id, type: ComponentType.RULE, value: value ? value : " ", parent};
}

export function createMark(id: number, value?: number, parent?: number): MarkComponent {
    return {id: id, type: ComponentType.MARK, value: value ? value : -1, parent};
}

export const Components = {
    reset(component: Component): Component {
        return {
            id: component.id, value: undefined, parent: component.parent,
            type: component.type === ComponentType.TREE ? ComponentType.EXP : component.type
        };
    },

    isConclusion(board: Board, component: Component): boolean {
        return component && component.parent !== undefined && board.components[component.parent].conclusion === component.id
    },

    isLeaf(board: Board, component: Component): boolean {
        return component && component.parent !== undefined &&
            board.components[component.parent].hypotheses.includes(component.id)
    },

    //Method responsible to check whether a component is contained in certain parent component
    containsParent(board: Board, component: Component, parent: number): boolean {
        while (component && component.id !== parent) {
            if (component.parent == null) break;
            component = board.components[component.parent];
        }
        return component?.id === parent
    },

    getLastParent(board: Board, component: Component): Component {
        while (component.parent)
            component = board.components[component.parent];
        return component
    },

    //TODO pode nao estar 100% correto!
    canDrop(board: Board, dragging?: Component, dropping?: Component): boolean {
        if (!dragging || !dropping) return false;

        const isValidDirection =
            (this.isConclusion(board, dropping) &&
                this.isLeaf(board, dragging) &&
                this.getLastParent(board, dragging).id !== dropping.parent &&
                this.getLastParent(board, dropping).id === dropping.parent) ||
            (this.isConclusion(board, dragging) &&
                this.isLeaf(board, dropping));

        const noParentConflict = !this.containsParent(board, dropping, dragging.parent!!)
        return isValidDirection && noParentConflict;
    }
};





