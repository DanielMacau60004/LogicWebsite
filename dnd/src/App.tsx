import './App.css';
import {GlobalState} from "./store";

import {Element} from "./components/Expressions";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from 'react';
import {
    Active,
    ClientRect,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DroppableContainer,
} from "@dnd-kit/core";
import {deleteItem, dragItem, redo, selectItem, undo} from "./store/board";
import {restrictToFirstScrollableAncestor} from "@dnd-kit/modifiers";
import {pointerWithin, rectIntersection} from '@dnd-kit/core';
import {RectMap} from '@dnd-kit/core/dist/store';
import {Coordinates} from '@dnd-kit/core/dist/types';

function App() {

    const dispatch: any = useDispatch()
    const {components, active, boardItems} = useSelector((state: GlobalState) => state.board)

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
            autoScroll={true}
            collisionDetection={handleCollisions}
        >
            <div style={{
                position:"relative",
                left:"5vw", top:"5vh",
                width: "90vw", height: "90vh",
                backgroundColor: "lightgray",  overflow: "auto" }}>
                {Object.values(boardItems).map((item) => (
                    <Element key={item} {...components[item]} components={components}/>
                ))}

                <DragOverlay dropAnimation={null}>
                    {(() => {
                        if (active)
                            return <Element {...{ ...active, position: undefined }} />;
                    })()}
                </DragOverlay>
            </div>
        </DndContext>
    );

    function handleDragStart(event: DragStartEvent) {
        dispatch(selectItem(Number(event.active.id)))
    }

    function handleDragEnd(event: DragEndEvent) {
        const {over, delta} = event

        /*console.log(components)
        console.log(active?.id)
        console.log(over?.id)
        console.log(event.collisions)*/

        dispatch(dragItem({over: Number(over?.id), position: {x: delta.x, y: delta.y}}))
    }

    function handleCollisions(args:
                                  { active: Active; collisionRect: ClientRect; droppableRects: RectMap; droppableContainers: DroppableContainer[]; pointerCoordinates: Coordinates | null; }) {
        const pointerCollisions = pointerWithin(args);

        if (pointerCollisions.length > 0) {
            return pointerCollisions;
        }

        return [];
    }

    function handleKeyPress(event: KeyboardEvent) {
        const {code, ctrlKey} = event

        if(code === 'Backspace') dispatch(deleteItem())
        else if (ctrlKey && code === 'KeyZ') dispatch(undo());
        else if (ctrlKey && code === 'KeyY') dispatch(redo());
    }

}

export default App;