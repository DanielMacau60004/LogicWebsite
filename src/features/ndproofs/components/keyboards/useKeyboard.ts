import React, {useRef} from "react";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {ComponentType} from "../../types/proofBoard";

type ExpKeyBoardProps = {
    type: ComponentType;
};

export function useKeyBoard({type}: ExpKeyBoardProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const {editing} = useSelector((state: GlobalState) => state.board)
    const target = document.getElementById(String(editing?.id)) as HTMLElement
    const show = editing !== undefined && editing.type === type
    const style: React.CSSProperties = {position: 'fixed', visibility: show ? "visible" : "hidden"};

    return {ref, target, show, style}
}