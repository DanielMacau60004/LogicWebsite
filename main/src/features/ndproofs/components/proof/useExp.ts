import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {selectEditingComponent, setEditable, updateComponent} from "../../../../store/boardSlice";
import {EXP_KEYBOARD_COMPONENT_ID} from "../../models/proofBoard";
import {ExpComponent} from "../../types/proofBoard";
import {deepCopy, forceInputChange} from "../../../../utils/general";

export function useExp({ exp }: { exp: ExpComponent }) {
    const id =  String(exp.id)
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const [value, setValue] = useState(exp.value)

    useEffect(() => {
        setValue(exp.value);

        if(ref.current)
            forceInputChange(ref.current, " ")
    }, [exp.value]);

    const isSelected = editing?.id === exp.id
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
        }, 150);

        return () => clearTimeout(timer);
    }, [components, dispatch, editing?.id, exp.id, value]);

    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (ref.current && event.relatedTarget &&
            (event.relatedTarget as HTMLElement)?.id.includes(EXP_KEYBOARD_COMPONENT_ID)) {
            event.preventDefault();
            event.stopPropagation();
            ref.current.focus();
            return;
        }

        const cleanValue = value?.trim() === "" ? undefined : value;
        if(cleanValue !== components[exp.id].value)
            dispatch(updateComponent({component: { ...components[exp.id], value: cleanValue }, saveState: true}));
        dispatch(setEditable(true));
        dispatch(selectEditingComponent(undefined));
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        dispatch(selectEditingComponent({ ...components[exp.id], value: value}))
    };

    return {id, isSelected, ref, onBlur, onChange, value}

}