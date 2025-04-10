import './App.css';

import "./style/Siderbar.css"
import {SideBar} from "./components/SideBar";
import {Controls} from "./components/Controls";
import {DndContext, DragEndEvent, DragOverlay, DragStartEvent, pointerWithin} from "@dnd-kit/core";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "./store";
import {deleteItem, dragItem, redo, selectItem, undo} from "./store/board";
import {restrictToFirstScrollableAncestor} from "@dnd-kit/modifiers";
import {Element} from "./components/ProofObjects";
import "./style/Board.css"

import React, {useEffect} from "react";

function App() {
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
        <div>
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToFirstScrollableAncestor]}
                collisionDetection={pointerWithin}
                autoScroll={true}
            >
                <SideBar/>

                <div id={"board"} className={"board"}>
                    {Object.values(boardItems).map((item) => (
                        <Element key={item} {...components[item]} components={components}/>
                    ))}
                </div>

                <DragOverlay dropAnimation={null}>
                    {active && <Element style={{ opacity: 0.4 }} {...{ ...active, position: undefined }} />}
                </DragOverlay>

                <Controls/>
            </DndContext>
        </div>
    );

    function handleDragStart(event: DragStartEvent) {
        const id = Number(event.active.id)
        let component = components[id]
        /*
        if(component === undefined) {
            component = deepCopy(componentsList[id])
            component.id = Object.keys(components).length
        }*/
        dispatch(selectItem(component))
    }

    function handleDragEnd(event: DragEndEvent) {
        const {over, delta} = event
        dispatch(dragItem({over: Number(over?.id), position: {x: delta.x, y: delta.y}}))
    }

}

export default App;