import {DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors,} from "@dnd-kit/core";

import {useBoard} from "./useBoard";
import "./Board.scss"
import {StateControl} from "../controls/state/StateControl";
import {DeleteControl} from "../controls/state/DeleteControl";
import {ExpKeyBoard} from "../keyboards/ExpKeyBoard";
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {SideBar} from "../sidebar/SideBar";
import {Tree} from "../proof/types/Tree";
import {TreeComponent} from "../../types/proofBoard";
import {RuleKeyBoard} from "../keyboards/RuleKeyBoard";
import {MarkKeyBoard} from "../keyboards/MarkKeyBoard";

export function Board() {
    const {isEditable, components, drag, boardItems} = useSelector((state: GlobalState) => state.board)
    const {handleDragStart, handleDragEnd, collisionAlgorithm} = useBoard()

    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor,);

    function getDndContext() {
        return <>
            <div id={"board"} className={"board"}>
                {Object.values(boardItems).map((item) => {
                    return (<Tree key={item} {...components[item] as TreeComponent} />);
                })}

                {drag && isEditable &&
                    <DragOverlay dropAnimation={null} className={"drag-overlay"}>
                        <Tree {...drag} />
                    </DragOverlay>
                }

                <div style={{backgroundColor: "red", position:"absolute", bottom: 0, left:0}}>
                    {Object.keys(components).length}
                </div>
            </div>
            <SideBar/>
            <StateControl/>
            <DeleteControl/>
            <ExpKeyBoard/>
            <RuleKeyBoard/>
            <MarkKeyBoard/>
        </>;
    }

    return (
        <>
            {isEditable ? (
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={collisionAlgorithm}
                    autoScroll={true}
                    sensors={sensors}
                >
                    {getDndContext()}
                </DndContext>
            ) : (getDndContext())}
        </>


    );

}