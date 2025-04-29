import {Rule} from "../rule/Rule";
import {APPEND_RULE_COMPONENT_ID} from "../../../models/proofBoard";
import {ComponentType} from "../../../types/proofBoard";
import {Mark} from "../mark/Mark";

export function ExpMenu({ show, markComponent }: { show: boolean, markComponent: any }) {
    if (!show) return null;
    return (
        <>
            <div className="rule-adder">
                <Rule rule={{ id: APPEND_RULE_COMPONENT_ID, type: ComponentType.RULE }} />
            </div>
            <div className="mark-adder">
                {markComponent && <Mark mark={markComponent} />}
            </div>
        </>
    );
}