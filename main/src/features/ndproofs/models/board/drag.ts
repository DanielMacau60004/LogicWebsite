import {Board, Component, Position, TreeComponent} from "../../types/proofBoard";
import {deepCopy} from "../../../../utils/general";
import {Boards} from "./logic";
import {BoardPosition} from "./position";
import {Components} from "../components/logic";

export const BoardDrag = {

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

        this.swapChildren(state, dragging, dropping, isDroppingConclusion, pDragging, pDropping, dragIndex, dropIndex);
        this.updatePositions(state, dragging, dropping, pDropping, parentDragging, parentDropping, isDroppingConclusion);

        state.active = dragging
    },

    swapChildren(state: Board, dragging: Component, dropping: Component, isConclusion: boolean, pDragging?: Component,
                 pDropping?: Component, dragIdx?: number, dropIdx?: number) {

        if (dropIdx !== undefined) pDropping!!.hypotheses[dropIdx] = dragging.id;
        else pDropping!!.conclusion = dragging.id;

        if (pDragging) {
            if (dragIdx !== undefined) pDragging.hypotheses[dragIdx] = dropping.id;
            else pDragging.conclusion = dropping.id;
        } else if (isConclusion && pDropping?.parent) {
            const ppDropping = state.components[pDropping.parent];
            const empty = Components.reset(state, pDropping);
            const idx = ppDropping?.hypotheses.indexOf(pDropping.id);
            if (idx !== undefined) ppDropping.hypotheses[idx] = empty.id;

            pDropping.parent = undefined;

            delete state.boardItems[dragging.id];
            state.boardItems[pDropping.id] = pDropping.id;
        } else {
            Boards.deleteEntireComponent(state, state.components[dropping.id])
            delete state.boardItems[dragging.id];
            delete state.components[dropping.id];
        }
    },

    updatePositions(state: Board, dragging: Component, dropping: Component, pDropping: Component,
                    parentDragging: Component, parentDropping: Component, isConclusion: boolean) {
        if (isConclusion) {
            if (pDropping?.parent) {
                const ppDropping = state.components[pDropping.parent];
                ppDropping.position = {...dragging.position};
                dragging.position = undefined;
            } else {
                parentDropping.position = {...parentDragging.position};
                parentDragging.position = undefined;
            }
        } else {
            state.components[dragging.id].position = undefined;
            if (state.components[dropping.id]) {
                state.components[dropping.id].position = undefined;
            }
        }
    },

    //Drop an element out of other
    dragOutsideComponent(state: Board, position: Position, dragging: TreeComponent) {
        let element = dragging;

        if (dragging.parent !== undefined) {
            const element = Components.reset(state, dragging)
            const pDragging = state.components[dragging.parent]
            const dragIndex = pDragging?.hypotheses.indexOf(dragging.id)

            if (dragIndex !== undefined) pDragging.hypotheses[dragIndex] = element.id
            else pDragging.conclusion = element.id

            state.boardItems[dragging.id] = dragging.id;
            dragging.parent = undefined;
            dragging.position = BoardPosition.computeRelativeCoordinates(state, dragging.id)
        }

        if (element.position) {
            element.position.x += position.x;
            element.position.y += position.y;

        } else
            element.position = {...position};

        state.active = element
    },

}
