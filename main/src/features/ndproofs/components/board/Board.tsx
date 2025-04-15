import {DndContext, DragOverlay,} from "@dnd-kit/core";
import {restrictToFirstScrollableAncestor} from "@dnd-kit/modifiers";
import {Element} from "../proof/ProofComponents";
import {useBoard} from "./useBoard";
import "./Board.scss"
import {StateControl} from "../controls/state/StateControl";
import {DeleteControl} from "../controls/state/DeleteControl";
import {AuxKeyBoard} from "../keyboard/AuxKeyBoard";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";

export function Board() {
    const {isEditable, components, active, boardItems} = useSelector((state: GlobalState) => state.board)
    const {handleDragStart, handleDragEnd, collisionAlgorithm} = useBoard()

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToFirstScrollableAncestor]}
            collisionDetection={collisionAlgorithm}
            autoScroll={true}
        >
            <div id={"board"} className={"board"}>
                {Object.values(boardItems).map((item) => {
                    return (<Element key={item} {...components[item]} />);
                })}

                {active && isEditable &&
                    <DragOverlay dropAnimation={null} className={"drag-overlay"}>
                        <Element {...active} />
                    </DragOverlay>
                }

                <StateControl/>
                <DeleteControl/>
                <AuxKeyBoard/>
            </div>
        </DndContext>

    );

}