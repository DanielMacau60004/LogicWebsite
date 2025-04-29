import React from "react";
import {useInputExp} from "./useInputExp";
import {ExpComponent} from "../../../types/proofBoard";

export function ExpInput({exp}: { exp: ExpComponent }) {
    const {isSelected, size, ref, value, onBlur, onChange, onKeyDown} = useInputExp({exp})

    return (
        <div className="proof-component-content">
            {isSelected ? (
                <input
                    id="input-expression"
                    ref={ref}
                    type="text"
                    size={size}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    className="proof-exp-input"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    aria-autocomplete="none"
                    onSubmit={onBlur}
                    onKeyDown={onKeyDown}
                    maxLength={50}
                />
            ) : (
                value
            )}
        </div>
    );
}