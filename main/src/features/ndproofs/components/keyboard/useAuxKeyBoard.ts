import React, {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {EProofType} from "../../types/proofBoard";
import {updateComponent} from "../../../../store/boardSlice";

export function useAuxBoard() {
    const ref = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();
    const {components, doubleClicked} = useSelector((state: GlobalState) => state.board)
    const target = document.getElementById(String(doubleClicked?.id)) as HTMLElement

    const show = doubleClicked !== undefined && doubleClicked.type === EProofType.EXP
    const style: React.CSSProperties = {position: show ? 'absolute' : 'fixed'};

    const onKeyClick = (char: string) => {
        const currentInput = document.getElementById('input-expression') as HTMLInputElement;

        if (currentInput && doubleClicked) {
            const cursorPos = currentInput.selectionStart ?? 0;
            const currentValue = currentInput.value;
            const newValue = currentValue.slice(0, cursorPos) + char + currentValue.slice(cursorPos);

            if (doubleClicked.id && components[doubleClicked.id]) {
                dispatch(updateComponent({
                    ...components[doubleClicked.id],
                    value: newValue,
                }));
            }

            const newCursorPos = cursorPos + 1;
            setTimeout(() => {
                currentInput.selectionStart = currentInput.selectionEnd = newCursorPos;
            }, 0);
        }
    };

    return {ref, target, show, style, onKeyClick}
}