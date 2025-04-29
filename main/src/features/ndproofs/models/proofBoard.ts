import {
    Board,
    BoardAction,
    Component,
    ComponentType,
    Position,
    PreviewComponent,
    PreviewMarkComponent,
    PreviewTreeComponent,
    RuleComponent,
    TreeComponent
} from "../types/proofBoard";
import {boardComponents} from "../boardInit";
import {Components, createPreviewExp, createPreviewMark} from "./proofComponents";
import {deepCopy} from "../../../utils/general";
import {RULE_DETAILS, RuleInfo} from "../types/proofRules";

export const BOARD_COMPONENT_ID = "board"
export const DELETE_COMPONENT_ID = "delete"
export const CLONE_COMPONENT_ID = "clone"
export const EXP_KEYBOARD_COMPONENT_ID = "exp-keyboard"
export const EXP_INPUT_COMPONENT_ID = "input-expression"
export const RULE_KEYBOARD_COMPONENT_ID = "rule-keyboard"
export const MARK_KEYBOARD_COMPONENT_ID = "mark-keyboard"

export const APPEND_MARK_COMPONENT_ID = -10
export const APPEND_RULE_COMPONENT_ID = -11

export const DOUBLE_CLICK_THRESHOLD  = 250

export const LOGICAL_SYMBOLS: string[] = ['⊥', '⊤', '¬', '∧', '∨', '→', '∀', '∃'];
export const GROUPING_SYMBOLS: string[] = ['(', ')'];
export const GREEK_LETTERS: string[] = ['α', 'β', 'γ', 'δ', 'φ', 'ψ'];
export const MARKS_SYMBOLS = Array.from({length: 20}, (_, i) => (i + 1).toString());

export const KeyActionMap: Map<string, BoardAction> = new Map([
    ['Backspace', BoardAction.Delete],
    ['Delete', BoardAction.Delete],
    ['Ctrl+KeyZ', BoardAction.Undo],
    ['Ctrl+KeyY', BoardAction.Redo],
    ['Ctrl+KeyC', BoardAction.Copy],
    ['Ctrl+KeyV', BoardAction.Paste],
]);

export function proofBoard(): Board {
    const board: Board = {
        currentId: 1,
        active: undefined,
        drag: undefined,
        isEditable: true,
        copy: undefined,
        editing: undefined,
        components: {},
        boardItems: {},
        redoStack: [],
        undoStack: []
    };

    boardComponents().forEach(component => {
        const id = Boards.appendComponent(board, component);
        board.boardItems[id] = id;
    });

    console.log(board.boardItems);
    console.log(board.components);

    return board;
}

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

    boardTranslation(): Position {
        const board = document.getElementById(BOARD_COMPONENT_ID);

        if (board) {
            const boardRect = board.getBoundingClientRect();
            return {x: -boardRect.x, y: -boardRect.y};
        }
        return {x: 0, y: 0};
    },

    computeRelativeCoordinates(id: number): Position {
        const htmlElement = document.getElementById(String(id));

        if (htmlElement) {
            const elementRect = htmlElement.getBoundingClientRect();
            return this.computeBoardCoordinates(elementRect)
        }

        return {x: 0, y: 0};
    },

    computeBoardCoordinates(position: Position): Position {
        const boardRect = this.boardTranslation();

        const x = position.x + boardRect.x;
        const y = position.y + boardRect.y;

        return {x, y};
    },

    createEmptyComponent(state: Board, target: Component): Component {
        const newID = state.currentId++;
        const element = Components.reset(target)
        element.id = newID;
        state.components[newID] = element;
        return element
    },

    dragInsideComponents(state: Board, elem1: Component, elem2: Component) {
        const isDroppingConclusion = Components.isConclusion(state, elem2);
        const dragging = !isDroppingConclusion ? state.components[elem1.parent!!] : state.components[elem2.parent!!]
        const dropping = isDroppingConclusion ? state.components[elem1.id] : state.components[elem2.id]

        const parentDragging = Components.getLastParent(state, dragging)
        const parentDropping = state.components[dropping.parent!!]//Components.getLastParent(state, dropping)

        const pDragging = state.components[dragging.parent!!]
        const pDropping = state.components[dropping.parent!!]

        if (elem1.value === undefined)
            elem1.value = elem2.value

        state.components[dragging.id].parent = pDropping.id
        state.components[dropping.id].parent = pDragging?.id

        const dragIndex = pDragging?.hypotheses?.indexOf(dragging.id)
        const dropIndex = pDropping?.hypotheses?.indexOf(dropping.id)


        if (dropIndex !== undefined) pDropping.hypotheses[dropIndex] = dragging.id
        else pDropping.conclusion = dragging.id

        if (pDragging) {
            if (dragIndex !== undefined) pDragging.hypotheses[dragIndex] = dropping.id
            else pDragging.conclusion = dropping.id
        } else if (isDroppingConclusion && pDropping.parent) {
            const ppDropping = state.components[pDropping.parent]
            const element = this.createEmptyComponent(state, pDropping)

            const pDropIndex = ppDropping?.hypotheses.indexOf(pDropping.id)
            ppDropping.hypotheses[pDropIndex] = element.id
            pDropping.parent = undefined

            delete state.boardItems[dragging.id];
            state.boardItems[pDropping.id] = pDropping.id;
        } else {
            delete state.boardItems[dragging.id];
            delete state.components[dropping.id];
        }

        //Fix position
        if (isDroppingConclusion) {
            if (pDropping.parent) {
                const ppDropping = state.components[pDropping.parent]
                ppDropping.position = {...dragging.position}
                dragging.position = undefined
            } else {
                parentDropping.position = {...parentDragging.position}
                parentDragging.position = undefined
            }
        } else {
            state.components[dragging.id].position = undefined
            if (state.components[dropping.id])
                state.components[dropping.id].position = undefined
        }

        state.active = dragging
    },

    //Drop an element out of other
    dragOutsideComponent(state: Board, position: Position, dragging: TreeComponent) {
        let element = dragging;

        if (dragging.parent !== undefined) {
            const element = this.createEmptyComponent(state, dragging)
            const pDragging = state.components[dragging.parent]
            const dragIndex = pDragging?.hypotheses.indexOf(dragging.id)

            if (dragIndex !== undefined) pDragging.hypotheses[dragIndex] = element.id
            else pDragging.conclusion = element.id

            state.boardItems[dragging.id] = dragging.id;
            dragging.parent = undefined;
            dragging.position = this.computeRelativeCoordinates(dragging.id)
            console.log(deepCopy(element))
        }

        if (element.position) {
            element.position.x += position.x;
            element.position.y += position.y;

        } else
            element.position = {...position};

        state.active = element
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

    updateRule(state: Board, rule: RuleComponent) {
        if (rule.value === undefined)
            return

        const tree = state.components[state.editing!!.parent!!] as TreeComponent
        const info = RULE_DETAILS[rule.value] as RuleInfo

        if (tree.hypotheses === undefined || tree.marks === undefined)
            return;

        const numHypotheses = tree.hypotheses.length
        const numMarks = tree.marks.length

        if (numHypotheses < info.hypothesesCount) {
            for (let i = 0; i < (info.hypothesesCount - numHypotheses); i++) {
                const id = this.appendComponent(state, createPreviewExp());
                tree.hypotheses.push(id);
                state.components[id].parent = tree.id
            }
        } else if (numHypotheses > info.hypothesesCount) {
            for (let i = info.hypothesesCount; i < numHypotheses; i++) {
                const id = tree.hypotheses[i]
                const element = state.components[id]
                const previous = document.getElementById(String(id))

                if (previous && element.type === ComponentType.TREE) {
                    const boundingBox = previous.getBoundingClientRect()
                    element.position = Boards.computeBoardCoordinates({x: boundingBox.x, y: boundingBox.y})
                    element.parent = undefined
                    state.boardItems[id] = id
                } else delete state.components[id]
            }
            tree.hypotheses = tree.hypotheses.slice(0, info.hypothesesCount)
        }

        if (numMarks < info.marksCount) {
            for (let i = 0; i < (info.marksCount - numMarks); i++) {
                const id = this.appendComponent(state, createPreviewMark());
                tree.marks.push(id);
                state.components[id].parent = tree.id
            }
        } else if (numMarks > info.marksCount) {
            for (let i = info.marksCount; i < numMarks; i++) {
                const id = tree.marks[i]
                delete state.components[id]
            }
            tree.marks = tree.marks.slice(0, info.marksCount)
        }

    }
}
