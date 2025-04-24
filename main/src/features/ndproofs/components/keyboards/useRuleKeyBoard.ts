import React, {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType, TreeComponent} from "../../types/proofBoard";
import {selectEditingComponent, updateComponent} from "../../../../store/boardSlice";
import {Boards} from "../../models/proofBoard";
import {RULE} from "../../types/proofRules";

export function useRuleBoard() {
    const dispatch: any = useDispatch()
    const ref = useRef<HTMLDivElement | null>(null);
    const {components, editing} = useSelector((state: GlobalState) => state.board)
    const target = document.getElementById(String(editing?.id)) as HTMLElement
    const show = editing !== undefined && editing.type === ComponentType.RULE
    const style: React.CSSProperties = {position: show ? 'absolute' : 'fixed'};

    const onKeyClick = (char: RULE) => {
        if (!show) return

        const currentInput = document.getElementById(String(editing?.id)) as HTMLInputElement;

        if (currentInput && editing) {
            dispatch(updateComponent({component: {...components[editing.id], value: char}, saveState: true}));
            dispatch(selectEditingComponent(undefined));
        }

    };

    return {ref, target, show, style, onKeyClick}
}