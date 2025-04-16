export interface Board {
    currentId: number;
    active: BoardComponent | undefined;
    drag: BoardComponent | undefined;
    editing: BoardComponent | undefined;
    isEditable: boolean;
    boardItems: { [key: number]: number };
    components: { [key: number]: BoardComponent };
    undoStack: Omit<Board, 'undoStack' | 'redoStack'>[];
    redoStack: Omit<Board, 'undoStack' | 'redoStack'>[];
}

export enum BoardAction {
    Delete = 'delete',
    Undo = 'undo',
    Redo = 'redo',
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

export interface BoardCreatorComponent {
    type: EProofType;
    position?: Position;
    isDraggable: boolean;
    isDroppable: boolean;

    [key: string]: any;
}

export interface BoardComponent {
    id: number | 0;
    type: EProofType;
    position?: Position;
    parent?: number;
    isDraggable: boolean;
    isDroppable: boolean;

    [key: string]: any;
}

