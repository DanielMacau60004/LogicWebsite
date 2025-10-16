import "./Keyboards.scss"
import {Overlay, Popover} from "react-bootstrap";
import React, {ReactNode} from "react";
import {Placement} from "react-bootstrap/types";

export function renderKeyButtons(
    id: string,
    symbols: string[],
    className: string,
    onKeyClick: (char: any) => void,
    title?: string
) {
    return symbols.map((symbol) => (
        <button
            id={`${id}-key`}
            key={symbol}
            className={className}
            onClick={() => onKeyClick(symbol)}
            title={title || undefined}
        >
            {symbol}
        </button>
    ));
}


type ExpKeyBoardProps = {
    id: string;
    ref: React.RefObject<HTMLDivElement | null>;
    show: boolean;
    target: HTMLElement | null;
    placement?: Placement | undefined;
    style?: React.CSSProperties;
    children: ReactNode;
};

export function Keyboard({id, ref, show, target, placement, style, children}: ExpKeyBoardProps) {
    return (
        <div id={id} tabIndex={-1} ref={ref} style={{ ...style, zIndex: 2000 }}>

            <Overlay
                show={show}
                target={target}
                placement={placement}
                container={ref}
                offset={[0, 10]}
                popperConfig={{
                    modifiers: [
                        {
                            name: 'preventOverflow',
                            options: {
                                boundary: 'viewport',
                            },
                        },
                        {
                            name: 'flip',
                            enabled: true,
                        },
                    ],
                }}
            >
                <Popover
                    id="popover-contained"
                    className="aux-keyboard"
                    style={style}
                >
                    {children}
                </Popover>
            </Overlay>
        </div>

    );
}