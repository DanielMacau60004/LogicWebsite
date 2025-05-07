import "./Keyboards.scss"
import React from "react";
import {useRuleBoard} from "./useRuleKeyboard";
import {RULE, RULE_DETAILS} from "../../types/proofRules";
import {Keyboard, renderKeyButtons} from "./Keyboard";
import {RULE_KEYBOARD_COMPONENT_ID} from "../../constants";

export function RuleKeyboard() {
    const {ref, target, show, style, canDelete, isFOL, onKeyClick} = useRuleBoard()

    return (
        <Keyboard id={RULE_KEYBOARD_COMPONENT_ID} ref={ref} show={show} target={target} style={style}
                  placement={"right-start"}>
            <div className="aux-keyboard-content scrollable">
                {canDelete && renderKeyButtons(RULE_KEYBOARD_COMPONENT_ID, ['⨯'], "key large delete", onKeyClick)}
                {renderKeyButtons(RULE_KEYBOARD_COMPONENT_ID,
                    Object.values(RULE).filter(rule => !RULE_DETAILS[rule].isFOL || isFOL),
                    "key large", onKeyClick)}
            </div>
        </Keyboard>

    );

}