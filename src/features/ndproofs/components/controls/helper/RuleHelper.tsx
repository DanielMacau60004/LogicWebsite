import {RULE, RULE_DETAILS} from "../../../types/proofRules";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {TreePreview} from "../../proof/tree/Tree";
import {BOARD_CONTROLLERS_ID} from "../../../constants";
import "./RuleHelper.scss"
import {ReactNode} from "react";

export function RuleHelper({rule, children, show}: { rule: RULE, children: ReactNode, show?: number }) {

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    const renderTooltip = (props: any) => {
        const isVisible  =props.hasDoneInitialMeasure
        const tooltipStyle = {
            ...props.style,
            ...(isVisible ? {} : { visibility: 'hidden' }),
        };

        return (
            <Tooltip id="button-tooltip" {...props} style={tooltipStyle}>
                <div className="board-preview">
                    <TreePreview tree={RULE_DETAILS[rule].preview} />
                </div>
            </Tooltip>
        );
    };

    return (
        <OverlayTrigger
            placement="right"
            delay={{show: show ? show : 0, hide: 0}}
            overlay={renderTooltip}
            container={document.getElementById(BOARD_CONTROLLERS_ID)}
            trigger={isTouchDevice ? undefined: ["hover","focus"]}
        >
            <div>
                {children}
            </div>
        </OverlayTrigger>
    )
}

