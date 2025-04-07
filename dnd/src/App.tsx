import './App.css';
import {GlobalState} from "./store";

import {Element} from "./components/Expressions";
import {useDispatch, useSelector} from "react-redux";
import React from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";
import {dragItem, selectItem} from "./store/board";

function App() {

    const dispatch: any = useDispatch()
    const {components, active, boardItems} = useSelector((state: GlobalState) => state.board)

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div style={{width: "90vw", height: "90vh", backgroundColor: "lightgray"}}>
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
        dispatch(dragItem({over: Number(over?.id), position: {x: delta.x, y: delta.y}}))
    }

}

export default App;