import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {DragOverlay, Modifier} from "@dnd-kit/core";
import {Tree} from "../proof/tree/Tree";
import {TreeComponent} from "../../types/proofBoard";
import {StateControl} from "../controls/state/StateControl";
import {ExpKeyboard} from "../keyboards/ExpKeyboard";
import {RuleKeyboard} from "../keyboards/RuleKeyboard";
import {MarkKeyboard} from "../keyboards/MarkKeyboard";
import {BOARD_COMPONENT_ID} from "../../constants";
import React from "react";
import {Draggable} from "../../../../components/Draggable";

export function BoardContent() {
    const {isEditable, components, drag, boardItems, zoom} = useSelector((state: GlobalState) => state.board)

    const applyZoom: (zoom: number) => Modifier = (zoom) => ({ transform }) => {
        if (!transform) return transform;

        return {
            ...transform,
            x: transform.x / zoom,
            y: transform.y / zoom,
        };
    };

    const boardStyle: React.CSSProperties = {
        width: `calc(100% / ${zoom})`,
        height: `calc(100vh / ${zoom})`,
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
    };

    return (
        <Draggable id={-1} className={"board-container"}>
            <div id={BOARD_COMPONENT_ID} className={"board"} style={boardStyle}>
                {Object.values(boardItems).map((item) => (
                    <Tree key={item} tree={components[item] as TreeComponent} />
                ))}

                {drag && isEditable &&
                    <DragOverlay dropAnimation={null} className={"drag-overlay"} modifiers={[applyZoom(zoom)]}>
                        <Tree tree={drag} />
                    </DragOverlay>
                }

            </div>

            {/*TODO TEMPORARY*/}
            <div style={{backgroundColor: "red", position:"absolute", bottom: 0, left:0}}>
                {Object.keys(components).length}
            </div>

            <StateControl/>
            <ExpKeyboard/>
            <RuleKeyboard/>
            <MarkKeyboard/>
        </Draggable>
    );

}