import {GREEK_LETTERS, GROUPING_SYMBOLS, EXP_KEYBOARD_COMPONENT_ID, LOGICAL_SYMBOLS} from "../../models/proofBoard";
import "./KeyBoards.scss"
import {Overlay, Popover} from "react-bootstrap";
import React from "react";
import {useExpBoard} from "./useExpKeyBoard";

function renderKeyButtons(
    symbols: string[],
    className: string,
    onKeyClick: (char: string) => void
) {

    return symbols.map((symbol) => (
        <button
            id={EXP_KEYBOARD_COMPONENT_ID+"-key"}
            key={symbol}
            className={className}
            onClick={() => onKeyClick(symbol)}
        >
            {symbol}
        </button>
    ));
}

export function ExpKeyBoard() {
    const {ref, target, show, style, onKeyClick} = useExpBoard()

    return (
        <div id={EXP_KEYBOARD_COMPONENT_ID} tabIndex={-1} ref={ref} style={style}>

            <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref}
                offset={[0,10]}
            >
                <Popover id="popover-contained" className="aux-keyboard">

                    <div className="aux-keyboard-content inline">
                        {renderKeyButtons(LOGICAL_SYMBOLS, "key", onKeyClick)}
                    </div>
                    <div className="aux-keyboard-content inline">
                        {renderKeyButtons(GREEK_LETTERS, "key", onKeyClick)}
                        {renderKeyButtons(GROUPING_SYMBOLS, "key large", onKeyClick)}
                    </div>
                </Popover>
            </Overlay>
        </div>

    );

}