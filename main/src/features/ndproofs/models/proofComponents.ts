import {
    Board,
    Component,
    ComponentType,
    Position,
    PreviewExpComponent,
    PreviewMarkComponent,
    PreviewRuleComponent,
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

    canDrop(board: Board, dragging?: Component, dropping?: Component): boolean {
        if (!dragging || !dropping) return false;

        const hasTheCorrectTypes = dragging.type === dropping.type && dragging.type === ComponentType.EXP

        const isValidDirection =
            (this.isConclusion(board, dropping) &&
                this.isLeaf(board, dragging) &&
                this.getLastParent(board, dragging).id !== dropping.parent &&
                this.getLastParent(board, dropping).id === dropping.parent) ||
            (this.isConclusion(board, dragging) &&
                this.isLeaf(board, dropping));

        const noParentConflict = !this.containsParent(board, dropping, dragging.parent!!)

        const hasSameContent = (dropping.value === undefined || dropping.value === dragging.value) ||
            (dragging.value === undefined || dragging.value === dropping.value)

        return hasTheCorrectTypes && isValidDirection && noParentConflict && hasSameContent;
    }
};





