import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {selectEditingComponent} from "../../../../../store/boardSlice";
import {RuleComponent} from "../../../types/proofBoard";
import {RULE_KEYBOARD_COMPONENT_ID} from "../../../constants";

const EMPTY_VALUE = "+"
const SHOW_DELAY = 150

export function useRule({rule}: { rule: RuleComponent }) {
    const id = String(rule.id)
    const ref = useRef<HTMLInputElement>(null);
    const {editing, components} = useSelector((state: GlobalState) => state.board)
    const dispatch: any = useDispatch()
    const value = rule.value ?  rule.value : EMPTY_VALUE;
    const isSelected = editing?.id === rule.id

    useEffect(() => {
        if (!isSelected || !ref.current) return;

            const input = ref.current;
            const timer = setTimeout(() => {
                if (document.activeElement !== input) {
                    input.focus();
                }
            }, SHOW_DELAY);

            return () => clearTimeout(timer);
    }, [components, dispatch, editing?.id, rule.id]);

    const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (ref.current && event.relatedTarget &&
            (event.relatedTarget as HTMLElement)?.id.includes(RULE_KEYBOARD_COMPONENT_ID)) {
            event.preventDefault();
            event.stopPropagation();
            ref.current.focus();
            return;
        }

        if(editing === undefined || editing.id === rule.id)
          dispatch(selectEditingComponent(undefined));
    };

    return {id, ref, value, onBlur}

}