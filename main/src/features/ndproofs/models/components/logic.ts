import {
    Board,
    Component,
    ComponentType,
} from "../../types/proofBoard";
import {Boards} from "../board/logic";
import {mark} from "./components";

export const Components = {

    reset(board: Board, component: Component, id?: number): Component {
        const componentId = id ?? board.currentId++;

        const type = component.type === ComponentType.TREE ? ComponentType.EXP : component.type
        let markId
        if(type === ComponentType.EXP)
            markId = Boards.appendComponent(board, mark(), id)
        const element = {id: componentId, value: undefined, parent: component.parent, type, mark: markId};
        board.components[componentId] = element;
        return element
    },

    isASimpleTree(component: Component): boolean {
        return component && component.type === ComponentType.TREE && component.hypotheses === undefined
    },

    isConclusion(board: Board, component: Component): boolean {
        return component && component.parent !== undefined && board.components[component.parent].conclusion === component.id
    },

    isLeaf(board: Board, component: Component): boolean {
        if(component === undefined || component.parent === undefined)
            return false

        const tree =board.components[component.parent]

        if(tree.hypotheses && tree.hypotheses.includes(component.id))
            return  true

        return tree.hypotheses === undefined
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

        const hasTheCorrectType = dragging.type === dropping.type && dragging.type === ComponentType.EXP

        const isValidDirection =
            (this.isConclusion(board, dropping) &&
                this.isLeaf(board, dragging) &&
                this.getLastParent(board, dragging).id !== dropping.parent &&
                this.getLastParent(board, dropping).id === dropping.parent)||
            (this.isConclusion(board, dragging) &&
                this.isLeaf(board, dropping));

        const noParentConflict = !this.containsParent(board, dropping, dragging.parent!!)

        const hasSameContent = (dropping.value === undefined || dropping.value === dragging.value) ||
            (dragging.value === undefined || dragging.value === dropping.value)

        const singleNotATree = (dragging.parent === undefined ||
            !Components.isASimpleTree(board.components[dragging.parent])) &&
            (dropping.parent === undefined ||
                !Components.isASimpleTree(board.components[dropping.parent]))

        return hasTheCorrectType && isValidDirection && noParentConflict && hasSameContent && singleNotATree;
    }
};





