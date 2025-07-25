import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {forceInputChange} from "../../../../utils/general";
import {ComponentType} from "../../types/proofBoard";
import {useKeyBoard} from "./useKeyboard";
import {EXP_INPUT_COMPONENT_ID} from "../../constants";
import {Boards} from "../../models/board/logic";
import {Components} from "../../models/components/logic";
import {setExercise} from "../../../../store/boardSlice";

function filterExpressionsByPrefix(
    expressions: Set<string> | string[],
    prefix: string
): string[] {
    const cleanPrefix = prefix.replace(/\s+/g, '').toLowerCase();
    const seen = new Set<string>();
    const arr = Array.isArray(expressions) ? expressions : Array.from(expressions);

    const filteredArr = arr.filter(expr =>
        expr.replace(/\s+/g, '').toLowerCase() !== cleanPrefix
    );

    const matchesWithScore: { expr: string; score: number }[] = [];

    for (let i = 0; i < filteredArr.length; i++) {
        const expr = filteredArr[i];
        const cleanExpr = expr.replace(/\s+/g, '').toLowerCase();

        if (cleanExpr.startsWith(cleanPrefix)) {
            if (!seen.has(cleanExpr)) {
                const percentageMatch = (cleanPrefix.length / cleanExpr.length) * 100;
                matchesWithScore.push({ expr, score: percentageMatch });
                seen.add(cleanExpr);
            }
        }
    }

    matchesWithScore.sort((a, b) => b.score - a.score);
    return matchesWithScore.map(entry => entry.expr);
}


export function useExpBoard() {
    const {components, editing, isFOL, exps} = useSelector((state: GlobalState) => state.board)
    const {ref, target, show, style} = useKeyBoard({type: ComponentType.EXP})

    let list: string[] = [];

    const currentInput = document.getElementById(EXP_INPUT_COMPONENT_ID) as HTMLInputElement;
    if (editing !== undefined && currentInput) {
        list = filterExpressionsByPrefix(exps, editing.value === undefined ? '' : editing.value).slice(0, 10)
    }

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

    const onKeyClickExp = (char: string) => {
        const currentInput = document.getElementById(EXP_INPUT_COMPONENT_ID) as HTMLInputElement;

        if (currentInput && editing) {
            if (editing.id && components[editing.id])
                forceInputChange(currentInput, char);

            const endPos = currentInput.value.length;
            currentInput.selectionStart = currentInput.selectionEnd = endPos;
        }
    };


    return {ref, target, show, style, isFOL, list, onKeyClick, onKeyClickExp}
}