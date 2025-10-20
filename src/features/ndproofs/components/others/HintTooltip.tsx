import React, { MouseEvent, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSpinner } from 'react-icons/fa';
import './HintTooltip.scss';
import { HiLightBulb } from 'react-icons/hi';
import { MdOutlineQuestionMark } from 'react-icons/md';
import { getHint } from '../../services/requests';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../store';
import { ExpComponent } from '../../types/proofBoard';

export function HintTooltip({ exp }: { exp?: ExpComponent }) {
    const { problem, isFOL, feedbackLevel } = useSelector((state: GlobalState) => state.board);
    const [activated, setActivated] = useState(false);
    const [hint, setHint] = useState<string | undefined>(undefined);

    const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
        if (!exp) return;
        if (hint !== undefined) return;
        setActivated(true);
        if (problem === undefined || exp.env === undefined) {
            setHint('Failed to load hint!');
            return;
        }
        const exercise = [...problem.premises, problem.conclusion];
        const goal: string[] = [...(exp.env ? Object.values(exp.env) as string[] : []), exp.value ?? ''];
        getHint(exercise, goal, isFOL, feedbackLevel).then(response => {
            if (response) setHint(response);
        });
    };

    const renderTooltip = (props: any) => {
        const isVisible = props.hasDoneInitialMeasure;
        const tooltipStyle = {
            ...props.style,
            ...(isVisible && activated && hint !== undefined ? {} : { visibility: 'hidden' }),
        };
        return (
            <Tooltip id="hint-tooltip" {...props} style={tooltipStyle}>
                {hint && hint.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </Tooltip>
        );
    };

    return (
        <OverlayTrigger
            key={hint}
            placement="top"
            overlay={renderTooltip}
            delay={{ show: 200, hide: 150 }}
            popperConfig={{
                modifiers: [
                    { name: 'preventOverflow', options: { boundary: 'viewport' } },
                    { name: 'flip', enabled: true },
                ],
            }}
        >
            <span
                id="hint"
                onPointerDown={handleClick}
                tabIndex={0}
                style={{ cursor: exp ? 'pointer' : 'default' }}
            >
                {!hint && activated ? (
                    <FaSpinner className="hint spin" />
                ) : hint === undefined ? (
                    <MdOutlineQuestionMark className="hint" />
                ) : (
                    <HiLightBulb className="hint" />
                )}
            </span>
        </OverlayTrigger>
    );
}
