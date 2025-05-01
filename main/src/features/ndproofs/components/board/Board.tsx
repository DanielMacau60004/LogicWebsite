import {DndContext, Modifier, MouseSensor, TouchSensor, useSensor, useSensors,} from "@dnd-kit/core";

import {useBoardDnd} from "./useBoardDnd";
import "./Board.scss"
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {BoardContent} from "./BoardContent";
import {useCollisionDetection} from "./useCollisionDetection";
import {useKeyboardShortCuts} from "./useKeyboardShortCuts";
import '@xyflow/react/dist/style.css';
import React, {useEffect} from 'react';
import {MAX_SCALE, MIN_SCALE} from "../../constants";
import {MiniMap, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {StateControl} from "../controls/state/StateControl";
import {ExpKeyboard} from "../keyboards/ExpKeyboard";
import {RuleKeyboard} from "../keyboards/RuleKeyboard";
import {MarkKeyboard} from "../keyboards/MarkKeyboard";
import {Transform} from "@dnd-kit/utilities/dist/css";
import {selectEditingComponent, setEditable, setZoom} from "../../../../store/boardSlice";

export function Board() {
    useKeyboardShortCuts()
    const {isEditable, drag, components, zoom} = useSelector((state: GlobalState) => state.board)
    const collisionAlgorithm = useCollisionDetection()
    const {handleDragStart, handleDragEnd} = useBoardDnd()

    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor,);

    const dispatch: any = useDispatch()
    const board = <BoardContent/>

    //TODO move to another file
    //Disable right click options
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    function scaleAwareModifier(): Modifier {
        return ({transform}: { transform: Transform }) => {
            return {
                ...transform,
                x: transform.x / zoom,
                y: transform.y / zoom,
            };
        };
    }


    return (
        <TransformWrapper
            panning={{disabled: drag !== undefined}}
            initialScale={zoom}
            minScale={MIN_SCALE}
            maxScale={MAX_SCALE}
            doubleClick={{disabled: true}}
            disabled={!isEditable}
            centerOnInit={true}
            onZoom={(e) => {
                dispatch(selectEditingComponent(undefined))
                dispatch(setZoom(Math.min(Math.max(e.state.scale, MIN_SCALE), MAX_SCALE)));
            }}
        >

            <TransformComponent wrapperClass="board-wrapper">
                <div className="board-background">
                    {isEditable ? (
                        <DndContext
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            collisionDetection={collisionAlgorithm}
                            autoScroll={true}
                            sensors={sensors}
                            modifiers={[scaleAwareModifier()]}
                        >
                            {board}
                        </DndContext>
                    ) : (
                        board
                    )}
                </div>
            </TransformComponent>

            <div className="minimap">
                <MiniMap borderColor={"var(--color-6)"}>
                    <div className="board-background-map">{board}</div>
                </MiniMap>
            </div>

            {/* TEMPORARY DEBUG */}
            <div style={{backgroundColor: "red", position: "absolute", bottom: 0, left: 0}}>
                {Object.keys(components).length} {zoom}
            </div>

            <StateControl/>
            <ExpKeyboard/>
            <RuleKeyboard/>
            <MarkKeyboard/>

        </TransformWrapper>
    );
}