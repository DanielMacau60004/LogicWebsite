import React from "react";
import {useInputExp} from "./useInputExp";
import {ExpComponent} from "../../../types/proofBoard";

export function ExpInput({exp}: { exp: ExpComponent }) {
    const {size, ref, value, onBlur, onChange, onKeyDown, onInput} = useInputExp({exp})

    return (
        <input
            id="input-expression"
            key={exp.id}
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
            onInput={onInput}
            onKeyDown={onKeyDown}
            maxLength={80}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        />
    )
}