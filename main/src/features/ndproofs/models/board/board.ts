import {
    Board,
} from "../../types/proofBoard";
import {boardComponents} from "../../boardInit";
import {Boards} from "./logic";

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
