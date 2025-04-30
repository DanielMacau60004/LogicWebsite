import {DragEndEvent, DragStartEvent,} from "@dnd-kit/core";
import {
    appendTree,
    copy,
    deleteComponent,
    dragComponent,
    paste,
    selectComponent,
    selectDraggingComponent,
    selectEditingComponent,
    setEditable,
} from "../../../../store/boardSlice";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {useRef} from "react";
import {ComponentType, ExpComponent, TreeComponent} from "../../types/proofBoard";
import { exp, rule, tree} from "../../models/components/components";
import {
    APPEND_RULE_COMPONENT_ID,
    CLONE_COMPONENT_ID,
    DELETE_COMPONENT_ID,
    DOUBLE_CLICK_THRESHOLD
} from "../../constants";
import {Components} from "../../models/components/logic";

export function useBoardDnd() {
    const dispatch: any = useDispatch()
    const state = useSelector((state: GlobalState) => state.board)
    const {isEditable, components} = useSelector((state: GlobalState) => state.board)
    const lastClickTime = useRef<number>(0);

    function isDoubleClick(): boolean {
        const currentTime = Date.now();
        const timeDifference = currentTime - lastClickTime.current;

        const isDouble = timeDifference <= DOUBLE_CLICK_THRESHOLD;
        lastClickTime.current = currentTime;
        return isDouble
    }

    function handleTreeActions(component: TreeComponent, clickedID?: string): boolean {
        if (clickedID === DELETE_COMPONENT_ID) {
            dispatch(selectComponent(Components.getLastParent(state, component)));
            dispatch(deleteComponent());
            return true
        } else if (clickedID === CLONE_COMPONENT_ID) {
            dispatch(selectComponent(Components.getLastParent(state, component)));
            dispatch(copy());
            dispatch(paste());
            return true
        }
        return false
    }

    function handleExpActions(component: ExpComponent): boolean {
        if (isDoubleClick()) {
            dispatch(selectEditingComponent(component))
            dispatch(selectComponent(undefined))
            dispatch(setEditable(false))
            return true
        }
        return false
    }

    function handleDragStart(event: DragStartEvent) {
        if (!isEditable) return

        let component = components[Number(event.active.id)];
        let dragging = undefined

        if (component.type === ComponentType.TREE)
            dragging = component as TreeComponent

        const clickedID = (event.activatorEvent.target as HTMLElement).closest('.proof-component')?.id;

        dispatch(selectEditingComponent(undefined))

        //TODO temporary Handle append rule
        if (component && clickedID === String(APPEND_RULE_COMPONENT_ID)) {
            dispatch(appendTree(tree(exp(component.value), rule(), [exp()], [])))
            dispatch(selectComponent(undefined))
            return;
        }

        //Handle tree actions menu
        if (component.type === ComponentType.TREE)
            if (handleTreeActions(component as TreeComponent, clickedID))
                return;

        //Select the clicked element
        if (!isNaN(Number(clickedID)) && Number(clickedID) in components)
            component = components[Number(clickedID)]

        dispatch(selectComponent(component))

        //Handle exp actions
        if (component.type === ComponentType.EXP)
            if (handleExpActions(component as ExpComponent))
                return;

        //Handle rule actions
        if (component.type === ComponentType.RULE) {
            dispatch(selectEditingComponent(component))
            dragging = undefined
        }

        //Handle mark actions
        if (component.type === ComponentType.MARK) {
            dispatch(selectEditingComponent(component))
            dragging = undefined
        }

        dispatch(selectDraggingComponent(dragging))
    }

    function handleDragEnd(event: DragEndEvent) {
        if (!isEditable) return

        const {over, delta} = event
        const overID = Number(over?.id)
        const cursorPosition = {x: delta.x, y: delta.y}

        dispatch(dragComponent({over: overID, position: cursorPosition}))
        dispatch(selectDraggingComponent(undefined))
    }

    return {handleDragStart, handleDragEnd}
}