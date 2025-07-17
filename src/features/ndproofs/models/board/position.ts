import {Board, Position,} from "../../types/proofBoard";
import {BOARD_COMPONENT_ID} from "../../constants";

export const BoardPosition = {

    boardTranslation(state: Board): Position {

        const board = document.getElementById(BOARD_COMPONENT_ID);

        if (board) {
            const boardRect = board.getBoundingClientRect();
            return {x: -boardRect.x / state.zoom, y: -boardRect.y / state.zoom};
        }
        return {x: 0, y: 0};
    },

    computeRelativeCoordinates(state: Board, id: number): Position {
        const htmlElement = document.getElementById(String(id));

        if (htmlElement) {
            const elementRect = htmlElement.getBoundingClientRect();
            return this.computeBoardCoordinates(state,elementRect)
        }

        return {x: 0, y: 0};
    },

    computeBoardCoordinates(state: Board, position: Position): Position {
        const boardRect = this.boardTranslation(state);

        const x = position.x / state.zoom + boardRect.x;
        const y = position.y / state.zoom + boardRect.y;

        return {x, y};
    },

}
