import "./Keyboards.scss"
import React from "react";
import {useExpBoard} from "./useExpKeyboard";
import {Keyboard, renderKeyButtons} from "./Keyboard";
import {EXP_KEYBOARD_COMPONENT_ID, GREEK_LETTERS, GROUPING_SYMBOLS, LOGICAL_SYMBOLS} from "../../constants";

export function ExpKeyboard() {
    const {ref, target, show, style, onKeyClick} = useExpBoard()

    return (
        <Keyboard id={EXP_KEYBOARD_COMPONENT_ID} ref={ref} show={show} target={target} style={style}
                  placement={"bottom"}>
            <div className="aux-keyboard-content inline">
                {renderKeyButtons(EXP_KEYBOARD_COMPONENT_ID, LOGICAL_SYMBOLS, "key", onKeyClick)}
            </div>
            <div className="aux-keyboard-content inline">
                {renderKeyButtons(EXP_KEYBOARD_COMPONENT_ID, GREEK_LETTERS, "key", onKeyClick)}
                {renderKeyButtons(EXP_KEYBOARD_COMPONENT_ID, GROUPING_SYMBOLS, "key large", onKeyClick)}
            </div>
        </Keyboard>

    );

}