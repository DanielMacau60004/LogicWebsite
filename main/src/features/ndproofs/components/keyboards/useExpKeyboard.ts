import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {forceInputChange} from "../../../../utils/general";
import {ComponentType} from "../../types/proofBoard";
import {EXP_INPUT_COMPONENT_ID} from "../../models/proofBoard";
import {useKeyBoard} from "./useKeyboard";

export function useExpBoard() {
    const {components, editing} = useSelector((state: GlobalState) => state.board)
    const {ref, target, show, style} = useKeyBoard({type: ComponentType.EXP})

    const onKeyClick = (char: string) => {
        const currentInput = document.getElementById(EXP_INPUT_COMPONENT_ID) as HTMLInputElement;
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