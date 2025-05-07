import {RULE, RULE_DETAILS} from "../../../types/proofRules";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {TreePreview} from "../../proof/tree/Tree";
import {BOARD_CONTROLLERS_ID} from "../../../constants";
import {FaQuestion} from "react-icons/fa";
import "./RuleHelper.scss"

export function RuleHelper({rule}: { rule: RULE }) {

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            <div className={"board-preview"}>
                <TreePreview tree={RULE_DETAILS[rule].preview}/>
            </div>
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 200 }}
            overlay={renderTooltip}
            container={document.getElementById(BOARD_CONTROLLERS_ID)}
        >
            <div className={"proof-component rule-helper"}>
                <div className={"proof-component-content"}>
                    <FaQuestion/>
                </div>
            </div>
        </OverlayTrigger>
    )
}