import {GREEK_LETTERS, GROUPING_SYMBOLS, LOGICAL_SYMBOLS} from "../../models/proofBoard";
import "./AuxKeyBoard.scss"
import {Overlay, Popover} from "react-bootstrap";
import React from "react";
import {useAuxBoard} from "./useAuxKeyBoard";

function renderKeyButtons(
    symbols: string[],
    className: string,
    onKeyClick: (char: string) => void
) {

    return symbols.map((symbol) => (
        <button
            id={"keyboard-key"}
            key={symbol}
            className={className}
            onClick={() => onKeyClick(symbol)}
        >
            {symbol}
        </button>
    ));
}

export function AuxKeyBoard() {
    const {ref, target, show, style, onKeyClick} = useAuxBoard()

    return (
        <div id={"keyboard"} tabIndex={-1} ref={ref} style={style}>

            <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref}
                offset={[0,10]}
            >
                <Popover id="popover-contained" className="aux-keyboard">

                    <div className="aux-keyboard-content">
                        {renderKeyButtons(LOGICAL_SYMBOLS, "key", onKeyClick)}
                    </div>
                    <div className="aux-keyboard-content">
                        {renderKeyButtons(GREEK_LETTERS, "key", onKeyClick)}
                        {renderKeyButtons(GROUPING_SYMBOLS, "key large", onKeyClick)}
                    </div>
                </Popover>
            </Overlay>
        </div>

    );

}