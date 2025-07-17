import React, {CSSProperties} from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {Placement} from "react-bootstrap/types";
import {FaExclamation} from "react-icons/fa";
import "./ErrorTootip.scss";
import {TreePreview} from "../proof/tree/Tree";
import {ExpPreview} from "../proof/exp/Exp";

interface TooltipWrapperProps {
    className?: string;
    style?: CSSProperties;
    errors?: { [key: string]: any };
    placement?: Placement | undefined;
    containerId?: string;
}

const ErrorTooltip: React.FC<TooltipWrapperProps> = (
    {
        className = '',
        style = {},
        errors,
        placement = 'left',
        containerId,
    }) => {

    const renderTooltip = (props: any) => {
        const isVisible = props.hasDoneInitialMeasure
        const tooltipStyle = {
            ...props.style,
            ...(isVisible ? {} : {visibility: 'hidden'}),
        };

        const tooltipContent = errors ? Object.entries(errors).map(([key, value]) => (
            <div key={key}>
                <div className="text-wrapper">
                    {key.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br/>
                        </React.Fragment>
                    ))}
                </div>

                {value && Array.isArray(value) && value.length > 0 && <div className={"board-previews"}>
                    {value.map((obj: any, i: number) => (
                        <div className="board-preview" key={i}>
                            {obj.type === "TREE" ? (
                                <TreePreview tree={obj}/>
                            ) : (
                                <ExpPreview exp={obj}/>
                            )}
                        </div>
                    ))}
                </div>
                }
            </div>
        )) : null;

        if (!tooltipContent || tooltipContent.length === 0) return <div/>;

        return (
            <Tooltip id="custom-tooltip" {...props} className="proof-incorrect-tooltip" style={tooltipStyle}>
                {tooltipContent}
            </Tooltip>
        );
    };

    return (
        <OverlayTrigger
            placement={placement}
            delay={{show: 250, hide: 200}}
            overlay={renderTooltip}
            container={containerId ? document.getElementById(containerId) || undefined : undefined}
            popperConfig={{
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport',
                        },
                    },
                    {
                        name: 'flip',
                        enabled: true,
                    },
                ],
            }}
        >
            <span className={`incorrect-tooltip-icon incorrect small ${className}`} style={style}>
                <div>
                    <FaExclamation/>
                </div>
            </span>
        </OverlayTrigger>
    );
};

export default ErrorTooltip;
