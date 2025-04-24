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
    appendTree,
    copy,
    deleteComponent,
    dragComponent,
    paste,
    redo,
    selectComponent,
    selectDraggingComponent,
    selectEditingComponent,
    setEditable,
    undo
} from "../../../../store/boardSlice";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {useEffect, useRef} from "react";
import {
    APPEND_MARK_COMPONENT_ID,
    APPEND_RULE_COMPONENT_ID,
    Boards,
    CLONE_COMPONENT_ID,
    DELETE_COMPONENT_ID,
    KeyActionMap
} from "../../models/proofBoard";
import {BoardAction, ComponentType, TreeComponent} from "../../types/proofBoard";
import {RectMap} from "@dnd-kit/core/dist/store";
import {Coordinates} from "@dnd-kit/core/dist/types";
import {
    Components,
    createPreviewExp,
    createPreviewMark,
    createPreviewRule,
    createPreviewTree
} from "../../models/proofComponents";
import {deepCopy} from "../../../../utils/general";

const clickThreshold = 350;

export function useBoard() {
    const dispatch: any = useDispatch()
    const state = useSelector((state: GlobalState) => state.board)
    const {isEditable, components} = useSelector((state: GlobalState) => state.board)
    const lastClickTime = useRef<number>(0);

    function handleKeyPress(event: KeyboardEvent) {
        const key = event.ctrlKey ? `Ctrl+${event.code}` : event.code;
        const action = KeyActionMap.get(key);

        if (action === BoardAction.Delete) {
            dispatch(deleteComponent());
        } else if (action === BoardAction.Undo) {
            dispatch(undo());
        } else if (action === BoardAction.Redo) {
            dispatch(redo());
        } else if (action === BoardAction.Copy) {
            dispatch(copy());
        } else if (action === BoardAction.Paste) {
            dispatch(paste());
        }

    }

    function handleDragStart(event: DragStartEvent) {
        if (!isEditable) return

        let id = Number(event.active.id);
        let component = components[id];
        let dragging = undefined

        if (component.type === ComponentType.TREE)
            dragging = component as TreeComponent

        dispatch(selectEditingComponent(undefined))
        const targetId = (event.activatorEvent.target as HTMLElement).closest('.proof-component')?.id;

        if (state.active && targetId && targetId === String(APPEND_RULE_COMPONENT_ID)) {
            dispatch(appendTree(createPreviewTree(createPreviewExp(state.active.value), createPreviewRule(), [createPreviewExp()], [])))
            dispatch(selectComponent(undefined))
            dragging = undefined
            console.log("APPEND RULE")
        }

        if (dragging && targetId === DELETE_COMPONENT_ID) {
            dispatch(selectComponent(Components.getLastParent(state, dragging)))
            dispatch(deleteComponent())
            console.log("DELETE")
            return;
        } else if (dragging && targetId === CLONE_COMPONENT_ID) {
            dispatch(selectComponent(Components.getLastParent(state, dragging)))
            dispatch(copy())
            dispatch(paste())
            console.log("DUPLICATE")
            return;
        } else if (!isNaN(Number(targetId)) && Number(targetId) in components) {
            id = Number(targetId);
            component = components[id];
            console.log("GENERAL COMPONENT")
        }

        dispatch(selectComponent(component))
        const currentTime = Date.now()
        if (currentTime - lastClickTime.current <= clickThreshold) {
            dispatch(selectEditingComponent(component))
            dispatch(selectComponent(undefined))
            console.log("DOUBLE CLICK")
            if (component.type === ComponentType.EXP) {
                dispatch(setEditable(false))
                console.log("EDIT EXP")
            }

        }

        if (component.type === ComponentType.RULE || component.type === ComponentType.MARK) {
            dispatch(selectEditingComponent(component))
            //dispatch(selectComponent(undefined))
            dragging = undefined
            console.log("EDIT MARK | RULE")
        }


        lastClickTime.current = currentTime;
        dispatch(selectDraggingComponent(dragging))
        console.log("##############")
    }

    function handleDragEnd(event: DragEndEvent) {
        if(!isEditable) return

        const {over, delta} = event

        if (over?.id === DELETE_COMPONENT_ID) dispatch(deleteComponent())
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