import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {BoardComponent} from "../../types/proofBoard";
import {selectEditingComponent, setEditable, updateComponent} from "../../../../store/boardSlice";

export function useExpression(exp: BoardComponent) {
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()
    const [value, setValue] = useState(exp.value)

    useEffect(() => {
        setValue(exp.value);
    }, [exp.value]);
    
    const isSelected = exp.value && editing?.id === exp.id
    useEffect(() => {
        if (editing?.id === exp.id) {
            const timer = setTimeout(() => {
                if (ref.current) {
                    const input = ref.current;

                    if(document.activeElement === input)
                        return

                    input.focus();
                    const length = input.value.length;
                    input.setSelectionRange(length, length);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [components, dispatch, editing?.id, exp.id, value]);

    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (ref.current && event.relatedTarget && (event.relatedTarget as HTMLElement)?.id.includes("keyboard")) {
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

    return {isSelected, ref, onBlur, onChange, value}

}