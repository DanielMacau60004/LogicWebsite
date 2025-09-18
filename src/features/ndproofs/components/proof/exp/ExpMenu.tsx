import {Rule} from "../rule/Rule";
import {ExpComponent, RuleComponent} from "../../../types/proofBoard";
import {Mark} from "../mark/Mark";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../../store";
import {APPENDS} from "../../../constants";
import {useExpMenu} from "./useExpMenu";

export function ExpMenu({exp, markComponent}: { exp: ExpComponent, markComponent: any }) {
    const state = useSelector((state: GlobalState) => state.board);
    const {showMark, showRuleTop, showRuleBottom} = useExpMenu({exp})

    const rule_top = state.components[APPENDS.APPEND_RULE_TOP_COMPONENT_ID]
    const rule_bottom = state.components[APPENDS.APPEND_RULE_BOTTOM_COMPONENT_ID]

    return (
        <>
            {showRuleTop && (
                <div className="rule-adder">
                    <Rule rule={rule_top as RuleComponent}/>
                </div>
            )}

            {showMark && markComponent && (
                <div className="mark-adder">
                    <Mark mark={markComponent}/>
                </div>
            )}

            {showRuleBottom && (
                <div className="rule-adder rule-bottom">
                    <Rule rule={rule_bottom as RuleComponent}/>
                </div>
            )}
        </>
    );
}