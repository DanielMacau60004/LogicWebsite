import {
    EXP_KEYBOARD_COMPONENT_ID,
    RULE_KEYBOARD_COMPONENT_ID, RULE_SYMBOLS
} from "../../models/proofBoard";
import "./KeyBoards.scss"
import {Overlay, Popover} from "react-bootstrap";
import React from "react";
import {useRuleBoard} from "./useRuleKeyBoard";

function renderKeyButtons(
    symbols: string[],
    className: string,
    onKeyClick: (char: string) => void
) {

    return symbols.map((symbol) => (
        <div
            id={RULE_KEYBOARD_COMPONENT_ID+"-key"}
            key={symbol}
            className={className}
            onClick={() => onKeyClick(symbol)}
        >
            {symbol}
        </div>
    ));
}

export function RuleKeyBoard() {
    const {ref, target, show, style, onKeyClick} = useRuleBoard()

    return (
        <div id={RULE_KEYBOARD_COMPONENT_ID} tabIndex={-1} ref={ref} style={style}>

            <Overlay
                show={show}
                target={target}
                placement="right-start"
                container={ref}
                offset={[0,10]}
            >
                <Popover id="popover-contained" className="aux-keyboard">

                    <div className="aux-keyboard-content scrollable">
                        {renderKeyButtons(RULE_SYMBOLS, "key large", onKeyClick)}
                    </div>
                </Popover>
            </Overlay>
        </div>

    );

}