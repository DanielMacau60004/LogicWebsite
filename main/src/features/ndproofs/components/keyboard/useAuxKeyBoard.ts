import React, {useRef} from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {EProofType} from "../../types/proofBoard";
import {forceInputChange} from "../../../../utils/general";

export function useAuxBoard() {
    const ref = useRef<HTMLDivElement | null>(null);
    const {components, editing} = useSelector((state: GlobalState) => state.board)
    const target = document.getElementById(String(editing?.id)) as HTMLElement
    const show = editing !== undefined && editing.type === EProofType.EXP
    const style: React.CSSProperties = {position: show ? 'absolute' : 'fixed'};

    const onKeyClick = (char: string) => {
        const currentInput = document.getElementById('input-expression') as HTMLInputElement;
        if (currentInput && editing) {
            const cursorPos = currentInput.selectionStart ?? 0;
            const currentValue = currentInput.value;
            const newValue = currentValue.slice(0, cursorPos) + char + currentValue.slice(cursorPos);

            if (editing.id && components[editing.id])
                forceInputChange(currentInput, newValue)

            currentInput.selectionStart = currentInput.selectionEnd = cursorPos + 1;
        }
    };

    return {ref, target, show, style, onKeyClick}
}