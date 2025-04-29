import {MARK_KEYBOARD_COMPONENT_ID, MARKS_SYMBOLS, }from "../../models/proofBoard";
import "./KeyBoards.scss"
import {Overlay, Popover} from "react-bootstrap";
import React from "react";
import {useMarkBoard} from "./useMarkKeyBoard";

function renderKeyButtons(
    symbols: string[],
    className: string,
    onKeyClick: (char: string) => void
) {

    return symbols.map((symbol) => (
        <div
            id={MARK_KEYBOARD_COMPONENT_ID+`-key`}
            key={symbol}
            className={className}
            onClick={() => onKeyClick(symbol)}
        >
            {symbol}
        </div>
    ));
}

export function MarkKeyBoard() {
    const {ref, target, show, style, onKeyClick, onDeleteClick, canDelete} = useMarkBoard()

    return (
        <div id={MARK_KEYBOARD_COMPONENT_ID} tabIndex={-1} ref={ref} style={style}>

            <Overlay
                show={show}
                target={target}
                placement="right-start"
                container={ref}
                offset={[0,10]}
            >
                <Popover id="popover-contained" className="aux-keyboard">
                    <div className="aux-keyboard-content scrollable">
                        {canDelete && renderKeyButtons(['x'], "key delete", onDeleteClick)}
                        {renderKeyButtons(MARKS_SYMBOLS, "key", onKeyClick)}
                    </div>
                </Popover>
            </Overlay>
        </div>

    );

}