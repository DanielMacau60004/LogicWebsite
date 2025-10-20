import {Placement} from "react-bootstrap/types";
import {
    addTree,
    appendTree,
    deleteComponent,
    selectComponent,
    selectDraggingComponent,
    selectEditingComponent, switchHelpMode, updateComponent
} from "../../../../../store/boardSlice";
import {Boards} from "../../../models/board/logic";
import {HintTooltip} from "../../others/HintTooltip";
import {Board, ComponentType, MarkComponent, RuleComponent, TreeComponent} from "../../../types/proofBoard";
import {simulateDrag} from "./Utils";
import {Rule} from "../../proof/rule/Rule";
import {Mark} from "../../proof/mark/Mark";
import {APPENDS} from "../../../constants";
import {exp, rule, tree, treeExp} from "../../../models/components/components";
import {RULE} from "../../../types/proofRules";
import ErrorTooltip from "../../others/ErrorTooltip";
import {Step} from "react-joyride";

export const steps: Step[] = [
    {
        target: ".root",
        title: "Welcome!",
        content: <div>Welcome to the Proof Editor! Each block represents part of a proof. Let’s start with a simple one.</div>,
        disableBeacon: true
    },
    {
        target: ".root",
        content: <div>Click a block to delete it, clone it, or submit it for checking.</div>,
        disableBeacon: true,
        spotlightPadding: 30,
        data: {
            onStart: (dispatch: any, state: Board) => {
                dispatch(selectComponent(state.components[state.currentId - 3]));
            }
        }
    },
    {
        target: ".key-board-tutorial",
        content: (
            <div>
                Double-click an expression to edit it.<br/>
                You can type <code>&amp;, and, |, or, -&gt;, to, ~, not, ...</code> to map to logical symbols.
                Or use the on-screen keyboard.
            </div>
        ),
        placement: "top",
        disableBeacon: true,
        spotlightPadding: 40,
        data: {
            targets: [".proof-exp", ".aux-keyboard"],
            onStart: (dispatch: any, state: Board) => {
                const component = Object.entries(state.boardItems)[0][1] + 1;
                dispatch(selectComponent(undefined));
                dispatch(selectEditingComponent(state.components[component]));
            }
        }
    },
    {
        target: ".proof-exp",
        content: (
            <div>
                Click an expression once to add a rule <Rule rule={{type: ComponentType.RULE} as RuleComponent}/>,
                or a mark <Mark mark={{type: ComponentType.MARK} as MarkComponent}/> to it.
            </div>
        ),
        disableBeacon: true,
        spotlightPadding: 60,
        data: {
            onStart: (dispatch: any, state: Board) => {
                const id = state.components[Object.entries(state.boardItems)[0][1]].conclusion;
                dispatch(selectEditingComponent(undefined));
                dispatch(selectComponent(state.components[id]));
                dispatch(updateComponent({component: {...state.components[APPENDS.APPEND_RULE_TOP_COMPONENT_ID], value: undefined, parent: id}, saveState: false}));
                dispatch(updateComponent({component: {...state.components[APPENDS.APPEND_RULE_BOTTOM_COMPONENT_ID], value: undefined, parent: id}, saveState: false}));
            }
        }
    },
    {
        target: ".aux-keyboard",
        content: (
            <div>
                Click a rule to see available options.<br/>
                Hover over a rule to preview how it applies.
            </div>
        ),
        disableBeacon: true,
        placement: "top",
        data: {
            onStart: (dispatch: any, state: Board) => {
                dispatch(switchHelpMode());
                dispatch(selectComponent(state.components[APPENDS.APPEND_RULE_TOP_COMPONENT_ID]));
                dispatch(selectEditingComponent(state.components[APPENDS.APPEND_RULE_TOP_COMPONENT_ID]));
            }
        }
    },
    {
        target: ".root",
        content: <div>Applying rules to formulas lets you build more complex proofs!</div>,
        disableBeacon: true,
        data: {
            onStart: (dispatch: any, state: Board) => {
                dispatch(selectEditingComponent(undefined));
                const id = state.components[Object.entries(state.boardItems)[0][1]].conclusion;
                const component = state.components[id];
                dispatch(selectComponent(component));
                dispatch(appendTree(tree(exp(component.value), rule(RULE.IMPLIES_ELIM), [exp()], [])));
            }
        }
    },
    {
        target: ".add-block",
        content: <div>Click here to add new proof blocks to your workspace.</div>,
        disableBeacon: true,
        data: {
            onStart: (dispatch: any, state: Board) => {
                const tree = state.components[Object.entries(state.boardItems)[0][1]];
                const component = state.components[tree.conclusion];
                const position = tree.position;
                dispatch(addTree({component: treeExp(exp(component.value, 1), {x: position.x-50, y: position.y + 140}), saveState: true}));
                dispatch(selectComponent(undefined));
            }
        }
    },
    {
        target: ".dragging-tutorial",
        content: (
            <div>
                Click a block to see where you can drag it!<br/>
                Drag blocks to build more complex blocks!
            </div>
        ),
        disableBeacon: true,
        spotlightPadding: 30,
        data: {
            targets: [".root:nth-child(1)", ".root:nth-child(2)"],
            onStart: (dispatch: any, state: Board) => {
                const tree = state.components[Object.entries(state.boardItems)[1][1]] as TreeComponent;
                const other = state.components[Object.entries(state.boardItems)[0][1]];
                dispatch(selectComponent(tree));
                dispatch(selectDraggingComponent(tree));
                simulateDrag(tree, other.hypotheses);
            }
        }
    },
    {
        target: ".root:nth-child(1)",
        content: (
            <div>
                Click the check button to verify your proof.<br/>
                Hover <ErrorTooltip errors={[]} /> to see errors or click <HintTooltip exp={undefined}/> for a hint.
            </div>
        ),
        disableBeacon: true,
        spotlightPadding: 70,
        placement: "top",
        data: {
            onStart: (dispatch: any, state: Board) => {
                dispatch(selectDraggingComponent(undefined));
                const other = state.components[Object.entries(state.boardItems)[0][1]];
                dispatch(selectComponent(other));
                dispatch(deleteComponent({ saveState: true }));
                const tree = state.components[Object.entries(state.boardItems)[1][1]];
                dispatch(selectComponent(tree));
                Boards.testTree(state, tree as TreeComponent, dispatch);
            }
        }
    },
    {
        target: ".exercise",
        content: <div>This section shows the exercise statement. You can drag formulas from here into your proofs.</div>,
        disableBeacon: true
    },
    {
        target: "#helpMode",
        content: <div>Toggle this switch to show or hide rule previews when hovering.</div>,
        disableBeacon: true,
        placement: "left"
    },
    {
        target: "#feedbackLevel",
        content: (
            <div>
                Click to adjust feedback level.<br/>
                Higher levels give more detailed messages.
            </div>
        ),
        disableBeacon: true,
        placement: "left"
    },
    {
        target: ".root",
        title: "You're Ready!",
        content: <div>Great job! You now know the basics of building proofs with this tool.</div>,
        disableBeacon: true,
        spotlightPadding: 40
    }
];
