import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {DragOverlay} from "@dnd-kit/core";
import {Tree} from "../proof/tree/Tree";
import {TreeComponent} from "../../types/proofBoard";
import {BOARD_COMPONENT_ID, BOARD_HEIGHT, BOARD_WIDTH} from "../../constants";
import React from "react";
import {Draggable} from "../../../../components/Draggable";

export function BoardContent() {
    const {isEditable, components, drag, boardItems} = useSelector((state: GlobalState) => state.board)

    const style: React.CSSProperties = {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
    };

    return (
        <Draggable id={BOARD_COMPONENT_ID} className={"board"} style={style}>
            {Object.values(boardItems).map((item) => (
                <Tree key={item} tree={components[item] as TreeComponent}/>
            ))}

            {drag && isEditable &&
                <DragOverlay dropAnimation={null} className={"drag-overlay"}>
                    <Tree tree={{...drag, drag: true}}/>
                </DragOverlay>
            }
        </Draggable>

    );

}