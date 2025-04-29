import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {selectEditingComponent} from "../../../../../store/boardSlice";
import {MarkComponent} from "../../../types/proofBoard";
import {MARK_KEYBOARD_COMPONENT_ID} from "../../../models/proofBoard";

const EMPTY_VALUE = "+"
const SHOW_DELAY = 150

export function useMark({mark}: { mark: MarkComponent }) {
    const id = String(mark.id)
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()
    const value = mark.value ? mark.value : EMPTY_VALUE
    const isSelected = editing?.id === mark.id

    useEffect(() => {
        if (!isSelected || !ref.current) return;

        const input = ref.current;
        const timer = setTimeout(() => {
            if (document.activeElement !== input)
                input.focus();
        }, SHOW_DELAY);

        return () => clearTimeout(timer);
    }, [components, dispatch, editing?.id, mark.id]);

    const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (ref.current && event.relatedTarget &&
            (event.relatedTarget as HTMLElement)?.id.includes(MARK_KEYBOARD_COMPONENT_ID)) {
            event.preventDefault();
            event.stopPropagation();
            ref.current.focus();
            return;
        }

        if (editing === undefined || editing.id === mark.id)
            dispatch(selectEditingComponent(undefined));
    };

    return {id, ref, value, onBlur}
}