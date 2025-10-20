import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState, store} from "../../../../../store";
import {selectEditingComponent, setExps, updateComponent} from "../../../../../store/boardSlice";
import {ExpComponent} from "../../../types/proofBoard";
import {EXP_KEYBOARD_COMPONENT_ID, KEYWORD_TO_SYMBOLS} from "../../../constants";
import {loadExps, testExpression} from "../../../services/requests";
import {Boards} from "../../../models/board/logic";
import {Components} from "../../../models/components/logic";

const SHOW_DELAY = 150

export function useInputExp({exp}: { exp: ExpComponent }) {
    const state = useSelector((state: GlobalState) => state.board)
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components, isFOL, feedbackLevel, problem, exps} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const [value, setValue] = useState<string>(exp.value ?? "");

    const isSelected = editing?.id === exp.id
    const size = value ? value.length + 2 : 2

    useEffect(() => {
        if (!isSelected || !ref.current) return;

        const input = ref.current;
        const timer = setTimeout(() => {
            const length = input.value.length;
            if (document.activeElement !== input) {
                if (length > 0)
                    input.setSelectionRange(length, length);
                input.focus()
            }
        }, SHOW_DELAY);

        return () => clearTimeout(timer);
    }, [components, dispatch, editing?.id, exp.id, value]);

    function finalizeEditing() {
        const input = ref.current;
        if (input === null) return;

        const currentValue = input.value;
        const cursor = input.selectionStart ?? 0;
        const {replaced, newValue, newCursor} = tryReplaceKeywordBeforeCursor(currentValue + ' ', cursor + 1);
        const cleanValue = !value?.trim() ? undefined : newValue?.trim();

        if (cleanValue !== components[exp.id].value) {
            //Check if the formula is correct
            if (cleanValue) {
                const existingExps = Boards.collectExpValues(state, Components.getLastParent(state, exp));

                if (problem) {
                    existingExps.add(cleanValue)
                    existingExps.add(problem.conclusion)
                    for (const premise of problem.premises)
                        existingExps.add(premise);
                }

                const exercise = Array.from(existingExps)
                const allExist = exercise.every(exp => exps.includes(exp));

                testExpression(cleanValue, isFOL, feedbackLevel).then(response => {
                    if (response === undefined)
                        return

                    const isWFF = !response.hasError
                    const value = isWFF ? response.exp.value : cleanValue
                    let errors: Record<string, any> = {};

                    if (!isWFF)
                        errors = response.exp.errors;

                    else if (!allExist)
                        loadExps(exercise, isFOL).then(r => dispatch(setExps(r)));

                    dispatch(updateComponent({
                        component: {...components[exp.id], value: value, isWFF: isWFF, errors: errors},
                        saveState: true
                    }));

                    if(!isWFF)
                        dispatch(updateComponent({component: {...Components.getLastParent(state, exp), hasErrors: true},
                            saveState: false, shouldNotResetTree: false}))

                })
            } else {
                dispatch(updateComponent({
                    component: {...components[exp.id], value: cleanValue},
                    saveState: true
                }));
            }
        }

        dispatch(selectEditingComponent(undefined));
    }

    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (ref.current && event.relatedTarget &&
            (event.relatedTarget as HTMLElement)?.id.includes(EXP_KEYBOARD_COMPONENT_ID)) {
            event.preventDefault();
            event.stopPropagation();
            ref.current.focus();
            return;
        }
        finalizeEditing()
    };

    function tryReplaceKeywordBeforeCursor(
        text: string,
        cursor: number
    ): { replaced: boolean; newValue: string; newCursor: number } {
        const before = text.slice(0, cursor - 1);
        const triggerChar = text[cursor - 1];
        const after = text.slice(cursor);

        for (const [keyword, {symbol, needsSpace}] of Object.entries(KEYWORD_TO_SYMBOLS)) {
            if (!before.endsWith(keyword)) continue;

            const keywordStart = cursor - 1 - keyword.length;
            const newValue =
                text.slice(0, keywordStart) + symbol + (needsSpace ? triggerChar : "") + after;

            let newCursor = keywordStart + symbol.length + 1;
            if (!needsSpace) newCursor -= 1;

            return {replaced: true, newValue, newCursor};
        }

        return {replaced: false, newValue: text, newCursor: cursor};
    }

    const handleKeywordReplacement = (
        input: HTMLInputElement | null,
        currentValue: string
    ) => {
        if (!input) return;

        const cursor = input.selectionStart ?? currentValue.length;
        const {replaced, newValue, newCursor} = tryReplaceKeywordBeforeCursor(currentValue, cursor);

        if (replaced) {
            setValue(newValue);
            dispatch(selectEditingComponent({...components[exp.id], value: newValue}));

            setTimeout(() => {
                input.setSelectionRange(newCursor, newCursor);
            }, 10);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        dispatch(selectEditingComponent({...components[exp.id], value: e.target.value}))
    };

    const onInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const newVal = input.value;

        setValue(newVal);
        dispatch(selectEditingComponent({...components[exp.id], value: newVal}));

        const native = e.nativeEvent as InputEvent;
        const inputType = native.inputType;
        const data = native.data;

        let lastChar: string | null = null;

        if ((inputType === "insertText" || inputType === "insertCompositionText") && data) {
            lastChar = data;
        }

        if (lastChar) {
            if (lastChar === " ") {
                setTimeout(() => {
                    handleKeywordReplacement(input, newVal);
                }, 10);
            }
        }

    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') finalizeEditing();

    };

    return {isSelected, size, ref, value, onBlur, onChange, onKeyDown, onInput}

}