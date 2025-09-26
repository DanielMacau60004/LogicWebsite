import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {selectEditingComponent} from "../../../../../store/boardSlice";
import {MarkComponent, PreviewMarkComponent} from "../../../types/proofBoard";
import {MARK_KEYBOARD_COMPONENT_ID, MarksColorsArray} from "../../../constants";

const EMPTY_VALUE = "+"
const SHOW_DELAY = 150

export function useMarkPreview({mark}: { mark: PreviewMarkComponent }) {
    const value = (mark.value !== undefined && mark.value !== null) ? String(mark.value) : EMPTY_VALUE
    const style = mark.value ? {backgroundColor: MarksColorsArray[(mark.value - 1) % MarksColorsArray.length]} as React.CSSProperties : undefined

    return {value, style}
}

export function useMark({mark}: { mark: MarkComponent }) {
    const id = String(mark.id)
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()
    const value = mark.value ? mark.value : EMPTY_VALUE
    const isSelected = editing?.id === mark.id
    const className = mark.value ? "" : "empty"
    const style = mark.value ? {backgroundColor: MarksColorsArray[(mark.value - 1) % MarksColorsArray.length]} as React.CSSProperties : undefined
    const hasValue = value !== EMPTY_VALUE

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

    return {id, ref, value, className, style, onBlur, hasValue}
}