import "./Keyboards.scss"
import React from "react";
import {useMarkBoard} from "./useMarkKeyboard";
import {Keyboard, renderKeyButtons} from "./Keyboard";
import {MARK_KEYBOARD_COMPONENT_ID, MARKS_SYMBOLS} from "../../constants";

export function MarkKeyboard() {
    const {ref, target, show, style, onKeyClick, canDelete} = useMarkBoard()

    return (
        <Keyboard id={MARK_KEYBOARD_COMPONENT_ID} ref={ref} show={show} target={target} style={style}
                  placement={"right-start"}>
            <div className="aux-keyboard-content small scrollable">
                {canDelete && renderKeyButtons(MARK_KEYBOARD_COMPONENT_ID, ['⨯'], "key delete", onKeyClick)}
                {renderKeyButtons(MARK_KEYBOARD_COMPONENT_ID, MARKS_SYMBOLS, "key", onKeyClick)}
            </div>
        </Keyboard>
    );

}