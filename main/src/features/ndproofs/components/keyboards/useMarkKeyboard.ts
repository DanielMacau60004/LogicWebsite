import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType} from "../../types/proofBoard";
import {selectEditingComponent, updateComponent} from "../../../../store/boardSlice";
import {useKeyBoard} from "./useKeyboard";

export function useMarkBoard() {
    const dispatch: any = useDispatch()
    const {components, editing} = useSelector((state: GlobalState) => state.board)
    const {ref, target, show, style} = useKeyBoard({type: ComponentType.MARK})

    const canDelete = show && editing?.parent && components[editing.parent].type === ComponentType.EXP

    const onKeyClick = (char: string) => {
        if (!show) return

        const currentInput = document.getElementById(String(editing?.id)) as HTMLInputElement;

        if (currentInput && editing) {
            const isAMark = !isNaN(Number(char))
            dispatch(updateComponent({
                component: {...components[editing.id], value: isAMark ? char : undefined},
                saveState: true
            }));
            dispatch(selectEditingComponent(undefined));
        }
    };

    return {ref, target, show, style, onKeyClick, canDelete}
}