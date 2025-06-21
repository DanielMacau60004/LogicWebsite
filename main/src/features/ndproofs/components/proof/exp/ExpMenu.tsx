import {Rule} from "../rule/Rule";
import {RuleComponent} from "../../../types/proofBoard";
import {Mark} from "../mark/Mark";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {APPENDS} from "../../../constants";

export function ExpMenu({show, markComponent}: { show: boolean, markComponent: any }) {
    const state = useSelector((state: GlobalState) => state.board);

    if (!show) return null;
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