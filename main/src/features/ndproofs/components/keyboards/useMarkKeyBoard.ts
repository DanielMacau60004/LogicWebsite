import React, {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType} from "../../types/proofBoard";
import {selectEditingComponent, updateComponent} from "../../../../store/boardSlice";
import {deepCopy} from "../../../../utils/general";

export function useMarkBoard() {
    const dispatch: any = useDispatch()
    const ref = useRef<HTMLDivElement | null>(null);
    const {components, editing} = useSelector((state: GlobalState) => state.board)
    const target = document.getElementById(String(editing?.id)) as HTMLElement
    const show = editing !== undefined && editing.type === ComponentType.MARK
    const style: React.CSSProperties = {position: show ? 'absolute' : 'fixed'};

    const canDelete = show && editing?.parent && components[editing.parent].type === ComponentType.EXP

    if(show)
    console.log(deepCopy(editing))
    const onKeyClick = (char: string) => {
        if (!show) return

        const currentInput = document.getElementById(String(editing?.id)) as HTMLInputElement;

        if (currentInput && editing) {
            dispatch(updateComponent({component: {...components[editing.id], value: char}, saveState: true}));
            dispatch(selectEditingComponent(undefined));
        }

    };

    const onDeleteClick = () => {
        if (!show) return

        const currentInput = document.getElementById(String(editing?.id)) as HTMLInputElement;

        if (currentInput && editing) {
            dispatch(updateComponent({component: {...components[editing.id], value: undefined}, saveState: true}));
            dispatch(selectEditingComponent(undefined));
        }

    };

    return {ref, target, show, style, onKeyClick, onDeleteClick, canDelete}
}