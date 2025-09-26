import {DndContext, MouseSensor, TouchSensor, useSensor, useSensors,} from "@dnd-kit/core";

import {useBoardDnd} from "./useBoardDnd";
import "./Board.scss"
import {useSelector} from "react-redux";
import {GlobalState} from "../../../../store";
import {BoardContent} from "./BoardContent";
import {useCollisionDetection} from "./useCollisionDetection";
import {useGeneralEvents} from "./useGeneralEvents";
import '@xyflow/react/dist/style.css';
import React from 'react';
import {APPENDS, BOARD_CONTROLLERS_ID, INT_SCALE, MAX_SCALE, MIN_SCALE} from "../../constants";
import {MiniMap, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {ExpKeyboard} from "../keyboards/ExpKeyboard";
import {RuleKeyboard} from "../keyboards/RuleKeyboard";
import {MarkKeyboard} from "../keyboards/MarkKeyboard";
import {useZoom} from "./useZoom";
import {BoardControl} from "../controls/board/BoardControl";
import {Exercise} from "../exercise/Exercise";
import {ToolsControl} from "../controls/tools/ToolsControl";
import {ProofState} from "../controls/proofState/ProofState";
import {StateControl} from "../controls/state/StateControl";
import {DangerControl} from "../controls/tools/DangerControl";

export function Board() {
    useGeneralEvents()
    const {isHelpMode, drag, components, zoom, editing, isFOL, feedbackLevel} = useSelector((state: GlobalState) => state.board)
    const collisionAlgorithm = useCollisionDetection()
    const {handleDragStart, handleDragEnd} = useBoardDnd()
    const {zoomModifier, onZoom} = useZoom()

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(isTouchDevice ? touchSensor : mouseSensor);

    const board = <BoardContent/>

    return (
        <TransformWrapper
            panning={{disabled: drag !== undefined || editing !== undefined}}
            initialScale={INT_SCALE}
            minScale={MIN_SCALE}
            maxScale={MAX_SCALE}
            doubleClick={{disabled: true}}
            disabled={editing !== undefined}
            onInit={(e) => {
                setTimeout(() => {
                    e.zoomToElement(String(APPENDS.APPEND_MAIN_COMPONENT_ID), INT_SCALE)
                }, 200)
            }}
            onZoom={onZoom}
        >
            {({zoomIn, zoomOut, instance, zoomToElement, ...rest}) => (
                <>

                    <DndContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        collisionDetection={collisionAlgorithm}
                        autoScroll={true}
                        sensors={sensors}
                        modifiers={[zoomModifier]}
                    >

                        <TransformComponent wrapperClass="board-wrapper">
                            <div className="board-background">
                                {board}

                            </div>
                        </TransformComponent>



                        {/*<div style={{backgroundColor: "red", position: "absolute", bottom: 0, right: 0}}>
                            Entities: {Object.keys(components).length} Zoom: {zoom}
                        </div>*/}

                        <div id={BOARD_CONTROLLERS_ID}>
                            <Exercise/>
                            <BoardControl instance={instance}/>
                            <ExpKeyboard/>
                            <RuleKeyboard/>
                            <MarkKeyboard/>

                            <StateControl/>
                            <ToolsControl zoomToElement={zoomToElement}/>
                            <DangerControl zoomToElement={zoomToElement}/>
                        </div>

                    </DndContext>

                    <div className="minimap">
                        <MiniMap borderColor={"var(--color-6)"}>
                            <div className="board-background-map">{board}</div>
                        </MiniMap>
                    </div>

                </>
            )}


        </TransformWrapper>
    );
}