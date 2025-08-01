import {DragEndEvent, DragStartEvent,} from "@dnd-kit/core";
import {
    addTree,
    copy,
    deleteComponent,
    dragComponent,
    paste, reportErrors,
    selectComponent,
    selectDraggingComponent,
    selectEditingComponent,
    sideDragging,
    updateComponent, updateCurrentProof,
} from "../../../../store/boardSlice";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {useRef} from "react";
import {
    BoardCurrentProof,
    ComponentType,
    ExpComponent,
    PreviewTreeComponent,
    TreeComponent
} from "../../types/proofBoard";
import {
    APPENDS,
    CLONE_COMPONENT_ID,
    DELETE_COMPONENT_ID,
    DOUBLE_CLICK_THRESHOLD,
    SUBMIT_COMPONENT_ID
} from "../../constants";
import {Components} from "../../models/components/logic";
import {testProof} from "../../services/requests";
import {Boards} from "../../models/board/logic";
import {exp, treeExp} from "../../models/components/components";
import {deepCopy} from "../../../../utils/general";

export function useBoardDnd() {
    const dispatch: any = useDispatch()
    const state = useSelector((state: GlobalState) => state.board)
    const {isEditable, components, editing, isFOL, problem, active} = useSelector((state: GlobalState) => state.board)
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
            dispatch(deleteComponent({saveState: true}));
            return true
        } else if (clickedID === CLONE_COMPONENT_ID) {
            dispatch(selectComponent(Components.getLastParent(state, component)));
            dispatch(copy());
            dispatch(paste());
            return true
        } else if (clickedID === SUBMIT_COMPONENT_ID && problem) {
            Boards.testTree(state, component, dispatch)
            return true;
        }

        return false
    }

    function setupSelectedRule(id: number) {
        const rule = components[APPENDS.APPEND_RULE_COMPONENT_ID]
        dispatch(updateComponent({component: {...rule, value: undefined, parent: id}, saveState: false}))

    }

    function handleExpActions(component: ExpComponent) {
        if ((isDoubleClick() && (component.editable ?? true)) ||
            (active !== undefined && active.id === component.id)) {
            dispatch(selectEditingComponent(component))
            dispatch(selectComponent(undefined))
        } else setupSelectedRule(component.id)
    }

    function handleDragStart(event: DragStartEvent) {
        if (!isEditable) return

        let component = components[Number(event.active.id)];
        let dragging = undefined

        if (editing && editing.type === ComponentType.EXP) return;

        if (!component) {
            dispatch(selectComponent(undefined))
            dispatch(selectEditingComponent(undefined)) //This was commented
            return;
        }

        if (component.clone) {
            dispatch(sideDragging({
                dragging: component as TreeComponent,
                preview: component.clone as PreviewTreeComponent
            }))
            return;
        }

        const clickedID = (event.activatorEvent.target as HTMLElement).closest('.proof-component')?.id;

        if (component.type === ComponentType.TREE) {
           //dragging = component as TreeComponent
            if(component.parent !== undefined) {
                if (!isNaN(Number(clickedID)) && Number(clickedID) in components) {
                    const cmp = components[Number(clickedID)]

                    if(cmp.type === ComponentType.EXP)
                        dragging = components[cmp.parent!] as TreeComponent
                    else dragging = Components.getLastParent(state, cmp) as TreeComponent
                }
            }
            else dragging = component as TreeComponent
        }

        dispatch(selectEditingComponent(undefined))

        //Handle tree actions menu
        if (component.type === ComponentType.TREE)
            if (handleTreeActions(component as TreeComponent, clickedID))
                return;

        //Select clicked element
        if (!isNaN(Number(clickedID)) && Number(clickedID) in components)
            component = components[Number(clickedID)]

        dispatch(selectComponent(component))

        const editable = (component.parent && (components[component.parent]?.editable ?? true));

        //Handle exp actions
        if (component.type === ComponentType.EXP && editable)
            handleExpActions(component as ExpComponent)

        //Handle rule actions
        if (component.type === ComponentType.RULE && editable) {
            dispatch(selectEditingComponent(component))
            dragging = undefined
        }

        //Handle mark actions
        if (component.type === ComponentType.MARK && editable) {
            dispatch(selectEditingComponent(component))
            dragging = undefined

            if (component.parent && components[component.parent].type === ComponentType.EXP)
                setupSelectedRule(components[component.parent].id)
        }

        dispatch(selectDraggingComponent(dragging))
    }

    function handleDragEnd(event: DragEndEvent) {
        if (!isEditable) return;

        const {over, delta} = event
        const overID = Number(over?.id)
        const cursorPosition = {x: delta.x, y: delta.y}

        dispatch(dragComponent({over: overID, position: cursorPosition}))
        dispatch(selectDraggingComponent(undefined))
    }

    return {handleDragStart, handleDragEnd}
}