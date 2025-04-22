import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {selectEditingComponent, setEditable, updateComponent} from "../../../../store/boardSlice";
import {KEYBOARD_COMPONENT_ID} from "../../models/proofBoard";
import {ExpComponent} from "../../types/proofBoard";

export function useExp({ exp }: { exp: ExpComponent }) {
    const id =  String(exp.id)
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()
    const [value, setValue] = useState(exp.value)

    useEffect(() => {
        setValue(exp.value);
    }, [exp.value]);
    
    const isSelected = editing?.id === exp.id
    useEffect(() => {
        if (editing?.id === exp.id) {
            const timer = setTimeout(() => {
                if (ref.current) {
                    const input = ref.current;

                    if(document.activeElement === input)
                        return

                    input.focus();

                    const length = input.value ? input.value.length : 0;
                    input.setSelectionRange(length, length);
                }
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [components, dispatch, editing?.id, exp.id, value]);

    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (ref.current && event.relatedTarget &&
            (event.relatedTarget as HTMLElement)?.id.includes(KEYBOARD_COMPONENT_ID)) {
            event.preventDefault();
            event.stopPropagation();
            ref.current.focus();

            return;
        }

        dispatch(updateComponent({ ...components[exp.id], value: value }));
        dispatch(setEditable(true));
        dispatch(selectEditingComponent(undefined));
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);

        dispatch(selectEditingComponent({ ...components[exp.id], value: value }))
    };

    return {id, isSelected, ref, onBlur, onChange, value}

}