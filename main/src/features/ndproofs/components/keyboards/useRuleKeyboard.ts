import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType} from "../../types/proofBoard";
import {selectEditingComponent, updateComponent} from "../../../../store/boardSlice";
import {RULE} from "../../types/proofRules";
import {useKeyBoard} from "./useKeyboard";

export function useRuleBoard() {
    const dispatch: any = useDispatch()
    const {components, editing} = useSelector((state: GlobalState) => state.board)
    const {ref, target, show, style} = useKeyBoard({type: ComponentType.RULE})

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