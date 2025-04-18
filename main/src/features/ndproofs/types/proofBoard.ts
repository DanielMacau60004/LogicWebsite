import {SideBarComponentList} from "./proofSidebar";

export interface Board {
    currentId: number;
    active: BoardComponent | undefined;
    drag: BoardComponent | undefined;
    editing: BoardComponent | undefined;
    copy: BoardPreviewComponent | undefined;
    isEditable: boolean;
    boardItems: { [key: number]: number };
    components: { [key: number]: BoardComponent };
    sideBarItems: SideBarComponentList[],
    undoStack: Omit<Board, 'undoStack' | 'redoStack' | 'sideBarItems'>[];
    redoStack: Omit<Board, 'undoStack' | 'redoStack' | 'sideBarItems'>[];
}

export enum BoardAction {
    Delete = 'delete',
    Undo = 'undo',
    Redo = 'redo',
    Copy = 'copy',
    Paste = 'paste'
}

export type Position = {
    x: number,
    y: number
}

export enum EProofType {
    EXP = 'EXP',
    RULE = 'RULE',
    MARK = 'MARK',
    TREE = 'TREE'
}

export interface BoardPreviewComponent {
    type: EProofType;
    position?: Position;
    isDraggable: boolean;
    isDroppable: boolean;
    isMovable: boolean;

    [key: string]: any;
}

export interface BoardComponent {
    id: number | 0;
    type: EProofType;
    position?: Position;
    parent?: number;
    isDraggable: boolean;
    isDroppable: boolean;
    isMovable: boolean;

    [key: string]: any;
}

