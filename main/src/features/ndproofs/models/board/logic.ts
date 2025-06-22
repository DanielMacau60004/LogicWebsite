import {
    Board,
    Component,
    ComponentType,
    PreviewComponent,
    PreviewMarkComponent,
    PreviewTreeComponent,
    RuleComponent,
    TreeComponent
} from "../../types/proofBoard";
import {RULE_DETAILS} from "../../types/proofRules";
import {BoardPosition} from "./position";
import {Components} from "../components/logic";
import {exp, mark} from "../components/components";

export const Boards = {

    canBeSubmitted(state: Board, component: PreviewComponent): boolean {
        switch (component.type) {
            case ComponentType.TREE:
                const tree = component as PreviewTreeComponent;
                const results = tree.hypotheses?.map(h => this.canBeSubmitted(state, h)) ?? [];
                return this.canBeSubmitted(state, tree.conclusion) && results.every(Boolean);

            case ComponentType.EXP:
                const expCMP = state.components[component.id];
                return !!expCMP?.value;

            default:
                return false;
        }
    },
    reportErrors(state: Board, component: PreviewComponent): void {
        switch (component.type) {
            case ComponentType.TREE:
                const tree = component as PreviewTreeComponent;
                tree.hypotheses?.forEach(h => this.reportErrors(state, h));
                this.reportErrors(state, tree.conclusion);
                break;

            case ComponentType.EXP:
                const expCMP = state.components[component.id];
                if (!expCMP?.value) {
                    state.components[component.id] = {
                        ...expCMP,
                        errors: {
                            ...(expCMP.errors || {}),
                            "Missing formula!": null
                        }
                    };
                }
                break;
        }
    },
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

                state.components[id] = { ...tree,
                    id, type: ComponentType.TREE, parent, position: tree.position, conclusion, rule, hypotheses, marks,
                    editable: tree.editable, clone: tree.clone
                }

                break;
            case ComponentType.EXP:
                let mark
                if (component.mark)
                    mark = this.appendComponent(state, component.mark, id)
                //component.parent = parent
                state.components[id] = {...component, id: id, mark, parent}
                break;
            default:
                //component.parent = parent
                state.components[id] = {...component, id, parent}
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
                if (component.mark)
                    mark = this.duplicateComponent(state, state.components[component.mark], id)
                state.components[id] = {...component, id, parent, mark}
                break;
            default:
                state.components[id] = {...component, id, parent}
                break;
        }

        return id;
    },

    convertToPreview(state: Board, id: number): PreviewComponent {
        const component = state.components[id];

        switch (component.type) {
            case ComponentType.TREE:
                const tree = component as any;

                // Recursively extract nested PreviewComponents
                const conclusion = this.convertToPreview(state, tree.conclusion);

                if(!Components.isASimpleTree(tree))
                    conclusion.mark  = undefined

                const rule = tree.rule !== undefined ? this.convertToPreview(state, tree.rule) : undefined;
                const hypotheses = tree.hypotheses?.map((hypId: number) => this.convertToPreview(state, hypId));
                const marks = tree.marks?.map((markId: number) => this.convertToPreview(state, markId));

                return {
                    ...tree,
                    conclusion,
                    rule,
                    hypotheses,
                    marks,
                } as PreviewTreeComponent;

            case ComponentType.EXP:
                let mark;
                if (component.mark !== undefined) {
                    mark = this.convertToPreview(state, component.mark);
                }
                return {
                    ...component,
                    mark,
                } as PreviewComponent;

            default:
                return {
                    ...component,
                } as PreviewComponent;
        }
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
                if (component.mark)
                    this.deleteEntireComponent(state, state.components[component.mark])
        }
    },

    updateRule(state: Board, rule: RuleComponent, tree: TreeComponent) {
        const ruleInfo = rule?.value ? RULE_DETAILS[rule.value] : undefined;
        if (!tree.hypotheses || !tree.marks) return;

        this.updateHypotheses(state, tree, ruleInfo?.hypothesesCount ?? 0);
        this.updateMarks(state, tree, ruleInfo?.marksCount ?? 0);

        if (ruleInfo === undefined) {
            const element = state.components[tree.conclusion]

            if (tree.parent) {
                const treeParent = state.components[tree.parent]
                const index = treeParent?.hypotheses?.indexOf(tree.id)

                treeParent.hypotheses[index] = tree.conclusion
                element.parent = treeParent.id
                delete state.components[tree.id];

                state.active = undefined

            }

            delete state.components[tree.rule!!]
            tree.rule = undefined
            tree.hypotheses = undefined

            const previous = document.getElementById(String(tree.conclusion));
            if (previous) {
                const rect = previous.getBoundingClientRect();
                tree.position = BoardPosition.computeBoardCoordinates(state, {x: rect.x, y: rect.y + 20});
            }

        }

    },

    updateHypotheses(state: Board, tree: TreeComponent, targetCount: number) {
        if (!tree.hypotheses) return

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
                    element.position = BoardPosition.computeBoardCoordinates(state, {x: rect.x, y: rect.y});
                    element.parent = undefined;
                    state.boardItems[id] = id;
                    state.active = element
                } else {
                    Boards.deleteEntireComponent(state, state.components[id])
                    delete state.components[id];
                }
            }
            tree.hypotheses = tree.hypotheses.slice(0, targetCount);
        }
    },

    updateMarks(state: Board, tree: TreeComponent, targetCount: number) {
        if (!tree.marks) return;

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
