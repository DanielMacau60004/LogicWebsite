import {Board, PreviewTreeComponent,} from "../../types/proofBoard";
import {Boards} from "./logic";
import {exp, expSidebar, mark, rule, treeExp} from "../components/components";
import {APPENDS, BOARD_HEIGHT, BOARD_WIDTH, INT_SCALE} from "../../constants";

export function board(exercise?: string[]): Board {
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
        isFOL: false,
        isHelpMode: false
    };

    APPENDS.APPEND_TREE_COMPONENT_ID = Boards.appendComponent(board, expSidebar(""))
    APPENDS.APPEND_RULE_COMPONENT_ID = Boards.appendComponent(board, rule())
    APPENDS.APPEND_MARK_COMPONENT_ID = Boards.appendComponent(board, mark())

    if (exercise) {
        boardExercise(exercise).forEach(component => {
            const id = Boards.appendComponent(board, component);
            board.exercise[id] = id;
        });

        const id = Boards.appendComponent(board, treeExp(exp(exercise[exercise.length - 1]), {
            x: BOARD_WIDTH / 2,
            y: BOARD_HEIGHT / 2
        }))
        board.boardItems[id] = id;
        APPENDS.APPEND_MAIN_COMPONENT_ID = id
    }

    console.log(board.boardItems);
    console.log(board.components);

    return board;
}

function boardExercise(exercise: string[]): PreviewTreeComponent[] {
    return exercise.map((exp, index) => {
        const mark = index === exercise.length - 1 ? undefined : index + 1;
        return expSidebar(exp, mark);
    });
}
