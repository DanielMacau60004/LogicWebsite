import {
    Board, Component,
    ComponentType,
    PreviewComponent,
    PreviewMarkComponent,
    PreviewTreeComponent, RuleComponent, TreeComponent
} from "../../types/proofBoard";
import {RULE_DETAILS} from "../../types/proofRules";
import {BoardPosition} from "./position";
import {Components} from "../components/logic";
import {exp, mark} from "../components/components";
import {deepCopy} from "../../../../utils/general";

export const Boards = {

    appendComponent(state: Board, component: PreviewComponent, parent?: number): number {
        const id = state.currentId++;

        switch (component.type) {
            case ComponentType.TREE:
                const tree = component as PreviewTreeComponent
                const conclusion = this.appendComponent(state, tree.conclusion, id)
                const rule = tree.rule ? this.appendComponent(state, tree.rule, id) : undefined
                const hypotheses = tree.hypotheses?.map((hypothesis: PreviewComponent) =>
                    this.appendComponent(state, hypothesis, id))
                const marks = tree.marks?.map((mark: PreviewMarkComponent) =>
                    this.appendComponent(state, mark, id));

                state.components[id] = {
                    id, type: ComponentType.TREE, parent, position: tree.position, conclusion, rule, hypotheses, marks
                }

                break;
            case ComponentType.EXP:
                let mark
                if(component.mark)
                    mark = this.appendComponent(state, component.mark, id)
                component.parent = parent
                state.components[id] = {...component, id: id, mark}
                break;
            default:
                component.parent = parent
                state.components[id] = {...component, id}
                break;
        }

        return id;
    },

    duplicateComponent(state: Board, component: Component, parent?: number): number {
        const id = state.currentId++;

        switch (component.type) {
            case ComponentType.TREE:
                const tree = component as TreeComponent
                const conclusion = this.duplicateComponent(state, state.components[tree.conclusion], id)
                const rule = tree.rule ? this.duplicateComponent(state, state.components[tree.rule], id) : undefined
                const hypotheses = tree.hypotheses?.map((hypothesis: number) =>
                    this.duplicateComponent(state, state.components[hypothesis], id))
                const marks = tree.marks?.map((mark: number) =>
                    this.duplicateComponent(state, state.components[mark], id));

                state.components[id] = {
                    id, type: ComponentType.TREE, parent, position: tree.position, conclusion, rule, hypotheses, marks
                }

                break;
            case ComponentType.EXP:
                let mark
                if(component.mark)
                    mark = this.duplicateComponent(state, state.components[component.mark], id)
                state.components[id] = {...component, id, parent, mark}
                break;
            default:
                state.components[id] = {...component, id, parent}
                break;
        }

        return id;
    },

    deleteEntireComponent(state: Board, component: Component) {
        delete state.components[component.id]
        switch (component.type) {
            case ComponentType.TREE:
                const tree = component as TreeComponent
                this.deleteEntireComponent(state, state.components[tree.conclusion])
                if (tree.rule)
                    this.deleteEntireComponent(state, state.components[tree.rule])

                if (tree.hypotheses)
                    tree.hypotheses.forEach((hypothesis: number) => this.deleteEntireComponent(state, state.components[hypothesis]))
                if (tree.marks)
                    tree.marks.forEach((mark: number) => this.deleteEntireComponent(state, state.components[mark]))

                break;
            case ComponentType.EXP:
                if(component.mark)
                    this.deleteEntireComponent(state, state.components[component.mark])
        }
    },

    updateRule(state: Board, rule: RuleComponent, tree: TreeComponent) {
        const ruleValue = rule.value;
        if (!ruleValue) return;

        const ruleInfo = RULE_DETAILS[ruleValue];
        if (!ruleInfo || !tree.hypotheses || !tree.marks) return;

        this.updateHypotheses(state, tree, ruleInfo.hypothesesCount);
        this.updateMarks(state, tree, ruleInfo.marksCount);

    },

    updateHypotheses(state: Board, tree: TreeComponent, targetCount: number) {
        if(!tree.hypotheses) return

        const current = tree.hypotheses.length;

        if (current < targetCount) {
            for (let i = 0; i < targetCount - current; i++) {
                const id = this.appendComponent(state, exp());
                state.components[id].parent = tree.id;
                tree.hypotheses.push(id);
            }
        } else if (current > targetCount) {
            for (let i = targetCount; i < current; i++) {
                const id = tree.hypotheses[i];
                const element = state.components[id];
                const previous = document.getElementById(String(id));

                if (previous && element.type === ComponentType.TREE) {
                    const rect = previous.getBoundingClientRect();
                    element.position = BoardPosition.computeBoardCoordinates(state, { x: rect.x, y: rect.y });
                    element.parent = undefined;
                    state.boardItems[id] = id;
                } else {
                    Boards.deleteEntireComponent(state, state.components[id])
                    delete state.components[id];
                }
            }
            tree.hypotheses = tree.hypotheses.slice(0, targetCount);
        }
    },

    updateMarks(state: Board, tree: TreeComponent, targetCount: number) {
        if(!tree.marks) return;

        const current = tree.marks.length;

        if (current < targetCount) {
            for (let i = 0; i < targetCount - current; i++) {
                const id = this.appendComponent(state, mark());
                state.components[id].parent = tree.id;
                tree.marks.push(id);
            }
        } else if (current > targetCount) {
            for (let i = targetCount; i < current; i++) {
                const id = tree.marks[i];
                delete state.components[id];
            }
            tree.marks = tree.marks.slice(0, targetCount);
        }
    },

    appendTree(state: Board, tree: PreviewTreeComponent): number | undefined {
        const active = state.active
        if (!active || !active.parent) return

        const newID = Boards.appendComponent(state, tree);
        const newTree = state.components[newID]

        const currentParent = state.components[active.parent]
        if (!Components.isASimpleTree(currentParent)) {
            const index = currentParent?.hypotheses?.indexOf(active.id)
            currentParent.hypotheses[index] = newID
            newTree.parent = currentParent.id

            Boards.deleteEntireComponent(state, active)
            delete state.components[active.id]
        } else {
            state.boardItems[newID] = newID
            newTree.position = currentParent.position

            Boards.deleteEntireComponent(state, currentParent)
            delete state.boardItems[currentParent.id]
        }

        return newID
    }

}
