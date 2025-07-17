import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType} from "../../types/proofBoard";
import {appendTree, selectComponent, selectEditingComponent, updateComponent} from "../../../../store/boardSlice";
import {RULE} from "../../types/proofRules";
import {useKeyBoard} from "./useKeyboard";
import {exp, rule, tree} from "../../models/components/components";

export function useRuleBoard() {
    const dispatch: any = useDispatch()
    const {components, editing, isFOL} = useSelector((state: GlobalState) => state.board)
    const {ref, target, show, style} = useKeyBoard({type: ComponentType.RULE})

    const canDelete = editing && components[editing.parent!!].type === ComponentType.TREE

    const onKeyClick = (char: string) => {
        if (!show) return

        const currentInput = document.getElementById(String(editing?.id)) as HTMLInputElement;

        if (currentInput && editing) {
            const parent = editing?.parent !== undefined ? components[editing.parent] : undefined;
            if(parent && parent.type === ComponentType.EXP) {
                dispatch(selectComponent(parent))
                dispatch(appendTree(tree(exp(parent.value), rule(char as RULE), [exp()], [])))
            } else{
                dispatch(updateComponent({component: {...components[editing.id], value: char}, saveState: true}));
            }

            dispatch(selectEditingComponent(undefined));
        }
    };

    return {ref, target, show, style, canDelete, isFOL, onKeyClick}
}