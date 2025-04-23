import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType} from "../../types/proofBoard";
import {selectEditingComponent, updateComponent} from "../../../../store/boardSlice";
import {MARK_KEYBOARD_COMPONENT_ID} from "../../models/proofBoard";

export function useMarkBoard() {
    const dispatch: any = useDispatch()
    const ref = useRef<HTMLDivElement | null>(null);
    const {components, editing} = useSelector((state: GlobalState) => state.board)
    const target = document.getElementById(String(editing?.id)) as HTMLElement
    const show = editing !== undefined && editing.type === ComponentType.MARK
    const style: React.CSSProperties = {position: show ? 'absolute' : 'fixed'};

    const onKeyClick = (char: string) => {
        if (!show) return

        const currentInput = document.getElementById(String(editing?.id)) as HTMLInputElement;

        if (currentInput && editing) {
            dispatch(updateComponent({component: {...components[editing.id], value: char}, saveState: false}));
            dispatch(selectEditingComponent(undefined));
        }

    };

    return {ref, target, show, style, onKeyClick}
}