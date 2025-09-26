import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {deepCopy} from "../utils/general";
import {
    Board,
    BoardCurrentProof,
    Component,
    ComponentType, NDProblem,
    Position,
    PreviewComponent,
    PreviewTreeComponent,
    RuleComponent,
    TreeComponent
} from "../features/ndproofs/types/proofBoard";
import {board,} from "../features/ndproofs/models/board/board";
import {Boards} from "../features/ndproofs/models/board/logic";
import {Components} from "../features/ndproofs/models/components/logic";
import {BoardDrag} from "../features/ndproofs/models/board/drag";
import {BoardPosition} from "../features/ndproofs/models/board/position";
import {MAX_SCALE, MIN_SCALE} from "../features/ndproofs/constants";
import {expSidebar, treeExp} from "../features/ndproofs/models/components/components";
import {feedbackLevels} from "../features/ndproofs/types/feedback";
import {testProof} from "../features/ndproofs/services/requests";
import {GlobalState} from "./index";

const MOVEMENT_THRESHOLD = 10;
const MAX_HISTORY_DEPTH = 20;

function cloneState(state: Board): Omit<Board, 'redoStack' | 'undoStack'> {
    return {
        currentId: state.currentId,
        active: undefined,
        drag: undefined,
        copy: undefined,
        isEditable: true,
        editing: undefined,
        boardItems: deepCopy(state.boardItems),
        components: deepCopy(state.components),
        zoom: state.zoom,
        exercise: state.exercise,
        problem: state.problem,
        isFOL: state.isFOL,
        isHelpMode: state.isHelpMode,
        currentProof: undefined,
        feedbackLevel: state.feedbackLevel,
        exps: state.exps
    };
}

function saveStateForUndo(state: Board) {
    state.undoStack.push(cloneState(state));

    if (state.undoStack.length > MAX_HISTORY_DEPTH) state.undoStack.shift();
    state.redoStack = [];
}

function handleUndo(state: Board, addRedo: boolean) {
    if (state.undoStack.length === 0) return;

    const prevState = state.undoStack.pop();
    if (prevState) {
        if (addRedo)
            state.redoStack.push(cloneState(state));
        Object.assign(state, prevState);
    }
}

function handleRedo(state: Board, addUndo: boolean) {
    if (state.redoStack.length === 0) return;

    const nextState = state.redoStack.pop();
    if (nextState) {
        if (addUndo)
            state.undoStack.push(cloneState(state));
        Object.assign(state, nextState);
    }
}

const slice = createSlice({
    name: 'board',
    initialState: board(false),
    reducers: {
        appendTree: (state, action: PayloadAction<PreviewTreeComponent>) => {
            if (!state.active || !state.active.parent) return
            saveStateForUndo(state);

            const newTree = Boards.appendTree(state, action.payload)
            if (newTree) {
                const tree = state.components[newTree]
                Boards.updateRule(state, state.components[tree.rule] as RuleComponent,
                    tree as TreeComponent)
            }

            state.active = undefined
        },
        addTree: (state, action: PayloadAction<{ component: PreviewTreeComponent, saveState: boolean }>) => {
            if (action.payload.saveState)
                saveStateForUndo(state);

            const id = Boards.appendComponent(state, action.payload.component)
            state.boardItems[id] = id
            state.active = state.components[id]
        },
        sideDragging: (state, action: PayloadAction<{ dragging: TreeComponent, preview: PreviewTreeComponent }>) => {
            saveStateForUndo(state);

            const newTree = Boards.appendComponent(state, action.payload.preview)

            if (newTree) {
                const tree = state.components[newTree] as TreeComponent
                Boards.updateRule(state, state.components[tree.rule!!] as RuleComponent,
                    tree as TreeComponent)

                tree.position = BoardPosition.computeRelativeCoordinates(state, action.payload.dragging.id)
                //state.boardItems[tree.id] = tree.id
                tree.cloned = true
                state.active = state.components[tree.conclusion]
                state.drag = tree
            }
        },
        selectComponent: (state, action: PayloadAction<Component | undefined>) => {
            state.active = action.payload;
        },
        selectDraggingComponent: (state, action: PayloadAction<TreeComponent | undefined>) => {
            state.drag = action.payload;

            if (state.drag !== undefined)
                state.drag = {...state.drag, position: BoardPosition.computeRelativeCoordinates(state, state.drag.id)}
        },
        selectEditingComponent: (state, action: PayloadAction<Component | undefined>) => {
            state.editing = action.payload;
        },
        setEditable: (state, action: PayloadAction<boolean>) => {
            state.isEditable = action.payload

            if (!state.isEditable) {
                state.active = undefined
                state.drag = undefined
                state.editing = undefined
            }
        },
        updateComponent: (state, action: PayloadAction<{ component: Component, saveState: boolean }>) => {
            const {component, saveState} = action.payload

            if (saveState) saveStateForUndo(state);

            if (component.type === ComponentType.RULE && state.editing?.parent) {
                Boards.updateRule(state, component as RuleComponent,
                    state.components[state.editing.parent] as TreeComponent)
                state.components[component.id] = component
            } else state.components[component.id] = component

            if (component.type === ComponentType.EXP)
                component.genHints = undefined
            //state.editing = component
        },
        deleteComponent: (state, action: PayloadAction<{ saveState: boolean }>) => {
            if (!state.isEditable) return

            const active = state.active;

            if (active && state.drag === undefined) {
                if (action.payload.saveState)
                    saveStateForUndo(state);
                if (active.type === ComponentType.RULE && state.active?.parent) {
                    Boards.updateRule(state, {...active, value: undefined} as RuleComponent,
                        state.components[state.active.parent] as TreeComponent)
                } else {

                    Boards.deleteEntireComponent(state, active)

                    if (active.parent) {
                        const parent = state.components[active.parent]
                        if (Components.isASimpleTree(parent) && parent.parent) {
                            state.components[parent.id] = Components.reset(state, parent, false, parent.id)
                        } else
                            state.components[active.id] = Components.reset(state, active, false, active.id)
                    } else {
                        delete state.boardItems[active.id];
                        delete state.components[active.id];
                    }
                }

                state.editing = undefined;
                state.active = undefined;
            }
        },
        dragComponent: (state, action: PayloadAction<{ over?: number, position: Position }>) => {
            if (!state.isEditable) return

            const {over, position} = action.payload;
            const drag = state.drag;
            const active = state.active;

            //Check if the movement is big enough to trigger the drag event
            if (Math.abs(position.x) + Math.abs(position.y) < MOVEMENT_THRESHOLD) {
                if (drag && drag.cloned) {
                    state.drag = undefined
                    state.active = undefined

                    Boards.deleteEntireComponent(state, drag)
                    handleUndo(state, false)
                }
                return
            }

            //Check if an expression is selected
            if (active === undefined || drag === undefined)
                return

            let dragging = state.components[active.id];
            let dropping = state.components[Number(over)];

            if(dragging.type === ComponentType.TREE)
                dragging = state.components[(Components.getLastParent(state, dragging) as TreeComponent).conclusion]
            if (Components.canDrop(state, dragging, dropping)) {
                saveStateForUndo(state);
                BoardDrag.dragInsideComponents(state, dragging, dropping)
            } else {
                saveStateForUndo(state);
                BoardDrag.dragOutsideComponent(state, position, state.components[drag!!.id] as TreeComponent)
            }


        },
        copy: (state) => {
            if (!state.isEditable) return

            const active = state.active;

            //Check if an expression is selected
            if (active === undefined)
                return

            if (active.type === ComponentType.TREE)
                state.copy = active.id
            else if (active.parent && state.components[active.parent].type === ComponentType.TREE)
                state.copy = state.components[active.parent].id

        },
        paste: (state) => {
            if (!state.isEditable) return

            if (state.copy && state.copy in state.components &&
                (state.editing === undefined || state.editing.type !== ComponentType.EXP)) {
                saveStateForUndo(state);

                const newID = Boards.duplicateComponent(state, state.components[state.copy])
                let newComponent = state.components[newID]

                const previous = document.getElementById(String(state.copy))
                if (previous) {
                    const boundingBox = previous.getBoundingClientRect()
                    newComponent.position = BoardPosition.computeBoardCoordinates(state, {
                        x: boundingBox.x + 20,
                        y: boundingBox.y + 20
                    })
                    state.boardItems[newID] = newID
                    state.active = newComponent
                }

            }

        },
        undo: (state) => {
            handleUndo(state, true)
        },
        redo: (state) => {
            handleRedo(state, true)
        },
        setZoom: (state, action: PayloadAction<number>) => {
            state.zoom = Number((Math.min(Math.max(action.payload, MIN_SCALE), MAX_SCALE)))
        },
        switchFOL: (state) => {
            state.isFOL = !state.isFOL
        },
        switchHelpMode: (state) => {
            state.isHelpMode = !state.isHelpMode
        },
        switchFeedbackLevel: (state) => {
            const currentIndex = feedbackLevels.indexOf(state.feedbackLevel);
            const nextIndex = (currentIndex + 1) % feedbackLevels.length;
            state.feedbackLevel = feedbackLevels[nextIndex];
        },
        testTree: (state, action: PayloadAction<TreeComponent>) => {

            if (state.problem === undefined) return
            const component = action.payload
            const conclusion = state.components[component.conclusion].value
            const exercise = [...state.problem.premises, state.problem.conclusion]
            const shouldCompareConclusion = conclusion === state.problem.conclusion
            const tree = Boards.convertToPreview(state, component.id) as PreviewTreeComponent

            if (!Boards.canBeSubmitted(state, tree)) {
                updateComponent({
                    component: {
                        ...component,
                        hasErrors: true,
                        solveExercise: undefined,
                        isValid: undefined
                    }, saveState: false
                })
                reportErrors(tree)
                return
            }
        },
        setExercise: (state, action: PayloadAction<{ exercise: NDProblem, isFOL: boolean}>) => {
            Object.assign(state, board(action.payload.isFOL, action.payload.exercise));
        },
        updateCurrentProof: (state, action: PayloadAction<any>) => {
            const result = action.payload
            const current: BoardCurrentProof = {
                premises: [],
                conclusion: undefined,
                hypotheses: []
            };

            if (state.currentProof) {
                const {premises, conclusion, hypotheses} = state.currentProof
                if (premises) premises.forEach(p => Boards.deleteEntireComponent(state, state.components[p]));
                if (conclusion) Boards.deleteEntireComponent(state, state.components[conclusion]);
                if (hypotheses) hypotheses.forEach(p => Boards.deleteEntireComponent(state, state.components[p]));
            }

            if (result.premises) {
                result.premises.forEach((p: string | undefined) => {
                    const id = Boards.appendComponent(state, expSidebar(p as string, undefined));

                    current.premises!.push(id);
                });
            }

            if (result.conclusion)
                current.conclusion! = Boards.appendComponent(state, expSidebar(result.conclusion, undefined));

            if (result.hypotheses) {
                Object.entries(result.hypotheses).forEach(([key, value]) => {
                    const id = Boards.appendComponent(state, expSidebar(value as string, Number(key)));
                    current.hypotheses!.push(id);
                });
            }

            state.currentProof = current
        },
        reportErrors(state, action: PayloadAction<PreviewComponent>): void {
            Boards.reportErrors(state, action.payload)
        },
        setExps(state, action: PayloadAction<string[]>): void {
            state.exps = action.payload
        }
    }
});

export const {
    appendTree,
    addTree,
    selectComponent,
    sideDragging,
    selectDraggingComponent,
    selectEditingComponent,
    setEditable,
    updateComponent,
    deleteComponent,
    dragComponent,
    copy,
    paste,
    undo,
    redo,
    setZoom,
    switchFOL,
    switchHelpMode,
    switchFeedbackLevel,
    testTree,
    setExercise,
    updateCurrentProof,
    reportErrors,
    setExps
} = slice.actions;

export const boardReducer = slice.reducer;
