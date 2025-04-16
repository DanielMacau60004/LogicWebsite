import {ProofComponent} from "./ProofComponent";
import {BoardComponent} from "../../types/proofBoard";
import {useExpression} from "./useExpression";

export function ExpComponent(exp: BoardComponent) {
    const {isSelected, ref, onBlur, onChange, value} = useExpression(exp)

    return (
        <ProofComponent{...exp} className={`proof-component proof-exp ${exp.className || ''}`}>
            {isSelected ?
                <input
                    id={"input-expression"}
                    ref={ref}
                    type="text"
                    size={value.length}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    className="proof-exp-input"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    aria-autocomplete="none"
                    maxLength={50}
                />
                : value
            }
        </ProofComponent>
    );
}