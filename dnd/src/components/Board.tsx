import React, {useEffect} from "react";
import {deleteItem, dragItem, redo, selectItem, undo} from "../store/board";
import {useDispatch, useSelector} from "react-redux";
import {DndContext, DragEndEvent, DragOverlay, DragStartEvent, pointerWithin} from "@dnd-kit/core";
import {restrictToFirstScrollableAncestor} from "@dnd-kit/modifiers";
import {Element} from "./Components";
import {GlobalState} from "../store";

export function Board(props: any) {
    const dispatch: any = useDispatch()
    const {components, active, boardItems} = useSelector((state: GlobalState) => state.board)

    function handleKeyPress(event: KeyboardEvent) {

        const {code, ctrlKey} = event

        if (code === 'Backspace') dispatch(deleteItem())
        else if (ctrlKey && code === 'KeyZ') dispatch(undo());
        else if (ctrlKey && code === 'KeyY') dispatch(redo());
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    });

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToFirstScrollableAncestor]}
            collisionDetection={pointerWithin}
            autoScroll={true}
        >
            <div id={"board"} className={"board"}>
                {Object.values(boardItems).map((item) => (
                    <Element key={item} {...components[item]} components={components}/>
                ))}

                <DragOverlay dropAnimation={null}>
                    {(() => {
                        if (active)
                            return <Element style={{opacity: 0.4}} {...{...active, position: undefined}} />;
                    })()}
                </DragOverlay>
            </div>
        </DndContext>

    )

    function handleDragStart(event: DragStartEvent) {
        dispatch(selectItem(Number(event.active.id)))
    }

    function handleDragEnd(event: DragEndEvent) {
        const {over, delta} = event
        dispatch(dragItem({over: Number(over?.id), position: {x: delta.x, y: delta.y}}))
    }
}
