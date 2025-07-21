import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {selectEditingComponent, updateComponent} from "../../../../../store/boardSlice";
import {ExpComponent} from "../../../types/proofBoard";
import {EXP_KEYBOARD_COMPONENT_ID, KEYWORD_TO_SYMBOLS} from "../../../constants";
import {testExpression} from "../../../services/requests";

const SHOW_DELAY = 150

export function useInputExp({exp}: { exp: ExpComponent }) {
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components, isFOL, feedbackLevel} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const [value, setValue] = useState(exp.value);

    const isSelected = editing?.id === exp.id
    const size = value ? value.length + 2 : 2

    useEffect(() => {
        if (!isSelected || !ref.current) return;

        const input = ref.current;
        const timer = setTimeout(() => {
            const length = input.value.length;
            //if (document.activeElement !== input) {
                if (length > 0)
                    input.setSelectionRange(length, length);
                input.focus()
            //}
        }, SHOW_DELAY);

        return () => clearTimeout(timer);
    }, [components, dispatch, editing?.id, exp.id, value]);

    function finalizeEditing() {
        const cleanValue = value?.trim() === "" ? undefined : value?.trim();

        if (cleanValue !== components[exp.id].value) {
            //Check if the formula is correct
            if (cleanValue) {
                testExpression(cleanValue, isFOL, feedbackLevel).then(response => {
                    if(response === undefined)
                        return

                    const isWFF = !response.hasError
                    const value = isWFF ? response.exp.value : cleanValue
                    let errors: Record<string, any> = {};

                    if(!isWFF) errors = response.exp.errors;

                    dispatch(updateComponent({
                        component: {...components[exp.id], value: value, isWFF: isWFF, errors: errors},
                        saveState: true
                    }));

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

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        dispatch(selectEditingComponent({...components[exp.id], value: value}))
    };

    function tryReplaceKeywordBeforeCursor(
        text: string,
        cursor: number
    ): { replaced: boolean; newValue: string; newCursor: number } {
        const before = text.slice(0, cursor - 1);
        const triggerChar = text[cursor - 1];
        const after = text.slice(cursor);

        for (const [keyword, { symbol, needsSpace }] of Object.entries(KEYWORD_TO_SYMBOLS)) {
            if (!before.endsWith(keyword)) continue;

            const keywordStart = cursor - 1 - keyword.length;
            const newValue =
                text.slice(0, keywordStart) + symbol + (needsSpace ? triggerChar: "") + after;

            let newCursor = keywordStart + symbol.length + 1;
            if (!needsSpace) newCursor -=1;

            return { replaced: true, newValue, newCursor };
        }

        return { replaced: false, newValue: text, newCursor: cursor };
    }



    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') finalizeEditing();

        //if (value === undefined) setValue("");
        const input = ref.current;
        if (input === null) return;
        const selectionStart = input.selectionStart ?? 0;
        const selectionEnd = input.selectionEnd ?? 0;

        if (e.key === "(") {
            e.preventDefault();
            const val = value === undefined ? "" : value
            const newValue = val.slice(0, selectionStart) + "()" + val.slice(selectionEnd);
            setValue(newValue);

            setTimeout(() => {
                input.setSelectionRange(selectionStart + 1, selectionStart + 1);
            }, 0);
            return;
        }

        if (e.key === "Backspace") {
            const val = value === undefined ? "" : value
            if (val[selectionStart - 1] === "(" && val[selectionStart] === ")") {
                e.preventDefault();
                const newValue =
                    val.slice(0, selectionStart - 1) +
                    val.slice(selectionStart + 1);
                setValue(newValue);
                setTimeout(() => {
                    input.setSelectionRange(selectionStart - 1, selectionStart - 1);
                }, 0);
                return;
            }
        }

        if ([" "].includes(e.key)) {
            setTimeout(() => {
                const currentValue = input.value;
                const cursor = input.selectionStart ?? 0;
                const { replaced, newValue, newCursor } = tryReplaceKeywordBeforeCursor(currentValue, cursor);
                if (replaced) {
                    setValue(newValue);
                    setTimeout(() => {
                        input.setSelectionRange(newCursor, newCursor);
                    }, 10);
                }
            }, 10);
        }


    };


    const onInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const cursor = input.selectionStart ?? 0;
        const { replaced, newValue, newCursor } = tryReplaceKeywordBeforeCursor(input.value, cursor);
        if (replaced) {
            setValue(newValue);
            setTimeout(() => {
                input.setSelectionRange(newCursor, newCursor);
            }, 0);
        } else {
            setValue(input.value);
        }
    };


    return {isSelected, size, ref, value, onBlur, onChange, onKeyDown}

}