import {Position,} from "../../types/proofBoard";
import {BOARD_COMPONENT_ID} from "../../constants";

export const BoardPosition = {

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

}
