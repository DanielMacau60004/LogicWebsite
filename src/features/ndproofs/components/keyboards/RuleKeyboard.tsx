import "./Keyboards.scss"
import React, {useRef, useState} from "react";
import {useRuleBoard} from "./useRuleKeyboard";
import {RULE, RULE_DETAILS} from "../../types/proofRules";
import {Keyboard, renderKeyButtons} from "./Keyboard";
import {RULE_KEYBOARD_COMPONENT_ID} from "../../constants";
import {RuleHelper} from "../controls/helper/RuleHelper";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";

export function RuleKeyboard() {
    const {isHelpMode} = useSelector((state: GlobalState) => state.board);
    const {ref, target, show, style, canDelete, isFOL, onKeyClick} = useRuleBoard()

    const [current, setCurrent] = useState<string | null>(null);
    const [nestedTarget, setNestedTarget] = useState<HTMLElement | null>(null);
    const nestedRef = useRef(null);

    const groupedByType = new Map<string, RULE[]>();

    for (const rule of Object.values(RULE)) {
        const detail = RULE_DETAILS[rule];
        if (!detail) continue;

        if (!detail.isFOL || isFOL) {
            const type = detail.type;
            if (!groupedByType.has(type)) {
                groupedByType.set(type, []);
            }

            groupedByType.get(type)!.push(rule);
        }
    }

    function renderKeyRuleButtons(
        id: string,
        symbols: RULE[],
        className: string,
        onKeyClick: (char: any) => void
    ) {
        return symbols.map((symbol) => (
            <button
                id={id + "-key"}
                key={symbol}
                className={className}
                onClick={() => onKeyClick(symbol)}
            >
                {isHelpMode ? <RuleHelper rule={symbol}>
                    {symbol}
                </RuleHelper> : symbol}
            </button>
        ));
    }

    function renderSubRuleKeyboard() {
        const showSub = show && current != null && nestedTarget != null && document.body.contains(nestedTarget);

        return (
            <Keyboard id={RULE_KEYBOARD_COMPONENT_ID} ref={nestedRef}
                      show={showSub}
                      target={nestedTarget} style={style}
                      placement={"right-start"}>
                <div className="aux-keyboard-content scrollable">
                    {renderKeyRuleButtons(RULE_KEYBOARD_COMPONENT_ID, groupedByType.get(current!) || [],
                        "key large", onKeyClick)}
                </div>
            </Keyboard>
        )
    }

    function renderKeyTypeRuleButtons(
        id: string,
        symbols: string[],
        className: string,
    ) {
        return symbols.map((symbol) => {
            const rules = groupedByType.get(symbol) ?? [];

            return (
                <button
                    id={id + "-key"}
                    key={symbol}
                    className={className}
                    onClick={(e) => {
                        if (rules.length === 1) {
                            onKeyClick(symbol)
                        } else {
                            setNestedTarget(e.currentTarget);
                            setCurrent(symbol);
                        }
                    }}
                    onMouseEnter={(e) => {
                        if (rules.length === 1) {
                            setNestedTarget(null)
                            setCurrent(null);
                        }else {
                            setNestedTarget(e.currentTarget);
                            setCurrent(symbol);
                        }
                    }}
                >
                    {rules.length === 1 &&
                        isHelpMode ? <RuleHelper rule={rules[0]}>
                                {symbol}
                            </RuleHelper> : symbol
                    }
                </button>
            );
        }).flat();
    }


    return (
        <>
            <Keyboard id={RULE_KEYBOARD_COMPONENT_ID} ref={ref} show={show} target={target} style={style}
                      placement={"right-start"}>
                <div className="aux-keyboard-content scrollable">
                    {canDelete && renderKeyButtons(RULE_KEYBOARD_COMPONENT_ID, ['⨯'], "key large delete", onKeyClick, "Remove rule")}
                    {renderKeyTypeRuleButtons(RULE_KEYBOARD_COMPONENT_ID, Array.from(groupedByType.keys()),
                        "key large")}
                </div>
            </Keyboard>
            {renderSubRuleKeyboard()}
        </>
    );

}