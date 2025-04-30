import {Rule} from "../rule/Rule";
import {ExpComponent, RuleComponent} from "../../../types/proofBoard";
import {Mark} from "../mark/Mark";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {APPENDS} from "../../../constants";

export function ExpMenu({exp, show, markComponent}: { exp: ExpComponent, show: boolean, markComponent: any }) {
    const state = useSelector((state: GlobalState) => state.board);

    //TODO...
    if (!show) return null; //is selected or the parent of the selectes is itself
    const rule = state.components[APPENDS.APPEND_RULE_COMPONENT_ID]

    return (
        <>
            <div className="rule-adder">
                <Rule rule={rule as RuleComponent}/>
            </div>
            <div className="mark-adder">
                {markComponent && <Mark mark={markComponent}/>}
            </div>
        </>
    );
}