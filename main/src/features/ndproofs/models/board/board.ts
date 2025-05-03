import {Board,} from "../../types/proofBoard";
import {boardComponents} from "../../boardInit";
import {Boards} from "./logic";
import {mark, rule} from "../components/components";
import {APPENDS, INT_SCALE} from "../../constants";

export function board(): Board {
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
        zoom: INT_SCALE
    };

    APPENDS.APPEND_RULE_COMPONENT_ID = Boards.appendComponent(board, rule())
    APPENDS.APPEND_MARK_COMPONENT_ID = Boards.appendComponent(board, mark())

    boardComponents().forEach(component => {
        const id = Boards.appendComponent(board, component);
        board.boardItems[id] = id;
    });


    console.log(board.boardItems);
    console.log(board.components);

    return board;
}
