import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {DragOverlay} from "@dnd-kit/core";
import {BOARD_COMPONENT_ID} from "../../models/proofBoard";
import {Tree} from "../proof/tree/Tree";
import {TreeComponent} from "../../types/proofBoard";
import {SideBar} from "../sidebar/SideBar";
import {StateControl} from "../controls/state/StateControl";
import {ExpKeyboard} from "../keyboards/ExpKeyboard";
import {RuleKeyboard} from "../keyboards/RuleKeyboard";
import {MarkKeyboard} from "../keyboards/MarkKeyboard";

export function BoardContent() {
    const {isEditable, components, drag, boardItems} = useSelector((state: GlobalState) => state.board)

    return (
        <>
            <div id={BOARD_COMPONENT_ID} className={"board"}>
                {Object.values(boardItems).map((item) => (
                    <Tree key={item} tree={components[item] as TreeComponent} />
                ))}

                {drag && isEditable &&
                    <DragOverlay dropAnimation={null} className={"drag-overlay"}>
                        <Tree tree={drag} />
                    </DragOverlay>
                }

                {/*TODO TEMPORARY*/}
                <div style={{backgroundColor: "red", position:"absolute", bottom: 0, left:0}}>
                    {Object.keys(components).length}
                </div>

            </div>
            <SideBar/>
            <StateControl/>
            <ExpKeyboard/>
            <RuleKeyboard/>
            <MarkKeyboard/>
        </>
    );

}