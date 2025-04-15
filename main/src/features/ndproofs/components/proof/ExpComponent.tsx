import {ProofComponent} from "./ProofComponent";
import {BoardComponent} from "../../types/proofBoard";
import {useExpression} from "./useExpression";

export function ExpComponent(exp: BoardComponent) {
    const {isSelected, ref, onBlur, onChange} = useExpression(exp)

    if(isSelected && exp.value)
    console.log(exp.value.length)
    return (
        <ProofComponent{...exp} className={`proof-component proof-exp ${exp.className || ''}`} >
            {
                isSelected ?
                    <input
                        id={"input-expression"}
                        ref={ref}
                        type="text"
                        size={exp.value.length}
                        onBlur={onBlur}
                        value={exp.value}
                        onChange={onChange}
                        className="proof-exp-input"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        aria-autocomplete="none"
                    />
                    : exp.value
            }
        </ProofComponent>
    );
}