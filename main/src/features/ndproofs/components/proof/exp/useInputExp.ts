import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {selectEditingComponent, setEditable, updateComponent} from "../../../../../store/boardSlice";
import {ExpComponent} from "../../../types/proofBoard";
import {forceInputChange} from "../../../../../utils/general";
import {EXP_KEYBOARD_COMPONENT_ID} from "../../../constants";

const EMPTY_VALUE = " "
const SHOW_DELAY = 150

export function useInputExp({ exp }: { exp: ExpComponent }) {
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const [value, setValue] = useState(exp.value)
    const isSelected = editing?.id === exp.id
    const size = value ? value.length + 2 : 2

    useEffect(() => {
        setValue(exp.value);
        if(ref.current)
            forceInputChange(ref.current, EMPTY_VALUE)
    }, [exp.value]);

    useEffect(() => {
        if (!isSelected || !ref.current) return;

        const input = ref.current;
        const timer = setTimeout(() => {
            if (document.activeElement !== input) {
                input.focus();
                forceInputChange(input, exp.value || "");

                const length = input.value.length;
                input.setSelectionRange(length, length);
            }
        }, SHOW_DELAY);

        return () => clearTimeout(timer);
    }, [components, dispatch, editing?.id, exp.id, value]);

    function finalizeEditing() {
        const cleanValue = value?.trim() === "" ? undefined : value;

        if (cleanValue !== components[exp.id].value) {
            dispatch(updateComponent({
                component: { ...components[exp.id], value: cleanValue },
                saveState: true
            }));
        }

        dispatch(setEditable(true));
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
        dispatch(selectEditingComponent({ ...components[exp.id], value: value}))
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') finalizeEditing()
    };


    return {isSelected, size, ref, value, onBlur, onChange, onKeyDown}

}