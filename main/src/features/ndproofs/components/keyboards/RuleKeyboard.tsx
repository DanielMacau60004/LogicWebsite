import "./Keyboards.scss"
import React from "react";
import {useRuleBoard} from "./useRuleKeyboard";
import {RULE} from "../../types/proofRules";
import {Keyboard, renderKeyButtons} from "./Keyboard";
import {RULE_KEYBOARD_COMPONENT_ID} from "../../constants";

export function RuleKeyboard() {
    const {ref, target, show, style, onKeyClick} = useRuleBoard()

    return (
        <Keyboard id={RULE_KEYBOARD_COMPONENT_ID} ref={ref} show={show} target={target} style={style}
                  placement={"right-start"}>
            <div className="aux-keyboard-content scrollable">
                {renderKeyButtons(RULE_KEYBOARD_COMPONENT_ID, Object.values(RULE), "key large", onKeyClick)}
            </div>
        </Keyboard>

    );

}