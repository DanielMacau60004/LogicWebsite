import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType, PreviewExpComponent, PreviewTreeComponent, TreeComponent} from "../../types/proofBoard";
import {
    appendTree,
    deleteComponent,
    selectComponent,
    selectEditingComponent,
    updateComponent
} from "../../../../store/boardSlice";
import {RULE} from "../../types/proofRules";
import {useKeyBoard} from "./useKeyboard";
import {exp, rule, tree} from "../../models/components/components";
import {APPENDS} from "../../constants";
import {Components} from "../../models/components/logic";
import {deepCopy} from "../../../../utils/general";
import {Boards} from "../../models/board/logic";

export function useRuleBoard() {
    const dispatch: any = useDispatch()
    const state = useSelector((state: GlobalState) => state.board)
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

                if(currentInput.id === String(APPENDS.APPEND_RULE_BOTTOM_COMPONENT_ID)) {
                    const t = Boards.convertToPreview(state, Components.getLastParent(state, editing).id) as (PreviewTreeComponent | PreviewExpComponent);
                    const pos =t.position
                    t.position = undefined
                    dispatch(appendTree(tree(exp(), rule(char as RULE), [t], [], pos)))

                }
                else {
                    dispatch(appendTree(tree(exp(parent.value), rule(char as RULE), [exp()], [])))
                }

            } else{
                dispatch(updateComponent({component: {...components[editing.id], value: char}, saveState: true}));
            }

            dispatch(selectEditingComponent(undefined));
        }
    };

    return {ref, target, show, style, canDelete, isFOL, onKeyClick}
}