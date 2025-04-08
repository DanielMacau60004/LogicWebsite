import './App.css';
import {GlobalState} from "./store";

import {Element} from "./components/Expressions";
import {useDispatch, useSelector} from "react-redux";
import React, {MouseEventHandler, useEffect} from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";
import {deleteItem, dragItem, redo, selectItem, undo} from "./store/board";

function App() {

    const dispatch: any = useDispatch()
    const {components, active, boardItems} = useSelector((state: GlobalState) => state.board)


    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {document.removeEventListener('keydown', handleKeyPress);};
    }, []);

    //TODO restrict bounds
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

    function handleKeyPress(event: KeyboardEvent) {
        const {code, ctrlKey} = event

        console.log(active)
        if(code === 'Backspace' && active) dispatch(deleteItem())
        else if (ctrlKey && code === 'KeyZ') dispatch(undo());
        else if (ctrlKey && code === 'KeyY') dispatch(redo());
    }

}

export default App;