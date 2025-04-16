import {
    Active,
    ClientRect,
    DragEndEvent,
    DragStartEvent,
    DroppableContainer,
    pointerWithin,
    rectIntersection
} from "@dnd-kit/core";
import {
    deleteComponent,
    dragComponent,
    redo,
    selectComponent,
    selectEditingComponent,
    selectDraggingComponent,
    setEditable,
    undo
} from "../../../../store/boardSlice";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {useEffect, useRef} from "react";
import {KeyActionMap} from "../../models/proofBoard";
import {BoardAction, EProofType} from "../../types/proofBoard";
import {RectMap} from "@dnd-kit/core/dist/store";
import {Coordinates} from "@dnd-kit/core/dist/types";

export function useBoard() {
    const dispatch: any = useDispatch()
    const {components} = useSelector((state: GlobalState) => state.board)
    const lastClickTime = useRef<number>(0);
    const clickThreshold = 350;

    function handleKeyPress(event: KeyboardEvent) {
        const key = event.ctrlKey ? `Ctrl+${event.code}` : event.code;
        const action = KeyActionMap.get(key);

        switch (action) {
            case BoardAction.Delete:
                dispatch(deleteComponent());
                break;
            case BoardAction.Undo:
                dispatch(undo());
                break;
            case BoardAction.Redo:
                dispatch(redo());
                break;
        }
    }

    function handleDragStart(event: DragStartEvent) {
        const id = Number(event.active.id)
        let component = components[id]
        dispatch(selectComponent(component))
        dispatch(selectComponent(component))

        const currentTime = Date.now()
        if (currentTime - lastClickTime.current <= clickThreshold) {
            dispatch(selectEditingComponent(component))

            if(component.type === EProofType.EXP && component.value)
                dispatch(setEditable(false))
        }

        lastClickTime.current = currentTime;
    }

    function handleDragEnd(event: DragEndEvent) {
        const {over, delta} = event

        if (over?.id === "delete") dispatch(deleteComponent())
        else dispatch(dragComponent({over: Number(over?.id), position: {x: delta.x, y: delta.y}}))
        dispatch(selectDraggingComponent(undefined))
    }

    function collisionAlgorithm(args: {
        active: Active;
        collisionRect: ClientRect;
        droppableRects: RectMap;
        droppableContainers: DroppableContainer[];
        pointerCoordinates: Coordinates | null;
    }) {
        const pointerCollisions = pointerWithin(args);
        if (pointerCollisions.length > 0)
            return pointerCollisions;

        return rectIntersection(args);
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    });


    return {handleDragStart, handleDragEnd, collisionAlgorithm}
}