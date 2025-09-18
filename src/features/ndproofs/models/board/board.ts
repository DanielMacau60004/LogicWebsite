import {Board, NDProblem, PreviewTreeComponent,} from "../../types/proofBoard";
import {Boards} from "./logic";
import {exp, expSidebar, mark, rule, treeExp} from "../components/components";
import {APPENDS, BOARD_HEIGHT, BOARD_WIDTH, INT_SCALE} from "../../constants";
import {FeedbackLevel} from "../../types/feedback";

export function board(isFOL: boolean, exercise?: NDProblem): Board {

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
        undoStack: [],
        zoom: INT_SCALE,
        exercise: [],
        problem: undefined,
        isFOL: isFOL,
        isHelpMode: true,
        currentProof: undefined,
        feedbackLevel: FeedbackLevel.Solution,
        exps: []
    };

    APPENDS.APPEND_TREE_COMPONENT_ID = Boards.appendComponent(board, expSidebar(""))
    APPENDS.APPEND_RULE_TOP_COMPONENT_ID = Boards.appendComponent(board, rule())
    APPENDS.APPEND_RULE_BOTTOM_COMPONENT_ID = Boards.appendComponent(board, rule())
    APPENDS.APPEND_MARK_COMPONENT_ID = Boards.appendComponent(board, mark())

    if (exercise) {
        board.problem = exercise

        boardExercise([...exercise.premises, exercise.conclusion]).forEach(component => {
            const id = Boards.appendComponent(board, component);
            board.exercise[id] = id;
        });

        const id = Boards.appendComponent(board, treeExp(exp(board.problem.conclusion), {
            x: BOARD_WIDTH / 2,
            y: BOARD_HEIGHT / 2
        }))

        board.boardItems[id] = id;
        APPENDS.APPEND_MAIN_COMPONENT_ID = id

    }


    return board;
}

function boardExercise(exercise: string[]): PreviewTreeComponent[] {
    return exercise.map((exp, index) => {
        //If we want to assign a mark to each premise
        const mark = index === exercise.length - 1 ? undefined : index + 1;
        return expSidebar(exp, undefined);
    });
}
