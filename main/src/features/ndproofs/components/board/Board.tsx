import {DndContext, MouseSensor, TouchSensor, useSensor, useSensors,} from "@dnd-kit/core";

import {useBoardDnd} from "./useBoardDnd";
import "./Board.scss"
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {BoardContent} from "./BoardContent";
import {useCollisionDetection} from "./useCollisionDetection";
import {useKeyboardShortCuts} from "./useKeyboardShortCuts";

export function Board() {
    useKeyboardShortCuts()
    const {isEditable} = useSelector((state: GlobalState) => state.board)
    const collisionAlgorithm = useCollisionDetection()
    const {handleDragStart, handleDragEnd} = useBoardDnd()

    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor,);

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
                    <BoardContent/>
                </DndContext>
            ) : <BoardContent/>}
        </>

    );

}