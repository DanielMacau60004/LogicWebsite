import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {BoardComponent} from "../../types/proofBoard";
import {selectDoubleClickedComponent, setEditable, updateComponent} from "../../../../store/boardSlice";

export function useExpression(exp: BoardComponent) {
    const ref = useRef<HTMLInputElement>(null);
    const {doubleClicked, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()

    const isSelected = exp.value && doubleClicked?.id === exp.id
    useEffect(() => {
        if (doubleClicked?.id === exp.id) {
            const timer = setTimeout(() => {
                if (ref.current) {
                    const input = ref.current;
                    const length = input.value.length;
                    input.setSelectionRange(length, length);
                    input.focus();
                }
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [doubleClicked?.id, exp.id]);

    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (ref.current && event.relatedTarget && (event.relatedTarget as HTMLElement).id === 'keyboard-key') {
            event.preventDefault();
            event.stopPropagation();
            ref.current.focus();
            return;
        }

        dispatch(setEditable(true));
        dispatch(selectDoubleClickedComponent(undefined));
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateComponent({ ...components[exp.id], value: e.target.value }));
    };

    return {isSelected, ref, onBlur, onChange}

}