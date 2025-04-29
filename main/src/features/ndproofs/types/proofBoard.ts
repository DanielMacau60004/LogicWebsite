import {RULE} from "./proofRules";

export interface Board {
    currentId: number;
    active: Component | undefined;
    drag: TreeComponent | undefined;
    editing: Component | undefined;
    copy: number | undefined;
    isEditable: boolean;
    boardItems: { [key: number]: number };
    components: { [key: number]: Component };
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

export enum ComponentType {
    EXP = "EXP",
    MARK = "MARK",
    RULE = "RULE",
    TREE = "TREE",
}

export interface PreviewComponent {
    type: ComponentType;
    [key: string]: any;
}

export interface PreviewExpComponent extends PreviewComponent {
    value: string | undefined;
    type: ComponentType.EXP;
    mark?: PreviewMarkComponent;
}

export interface PreviewMarkComponent extends PreviewComponent {
    value: number | undefined;
    type: ComponentType.MARK;
}

export interface PreviewRuleComponent extends PreviewComponent {
    value: RULE | undefined;
    type: ComponentType.RULE;
}

export interface PreviewTreeComponent extends PreviewComponent {
    conclusion: PreviewExpComponent,
    marks?: PreviewMarkComponent[],
    rule?: PreviewRuleComponent,
    hypotheses?: (PreviewExpComponent | PreviewTreeComponent)[]
    position?: Position
}

export interface Component extends PreviewComponent {
    id: number;
    parent?: number;
}

export interface ExpComponent extends Component {
    value?: string;
    type: ComponentType.EXP;
    mark?: number;
}

export interface MarkComponent extends Component {
    value?: number;
    type: ComponentType.MARK;
}

export interface RuleComponent extends Component {
    value?: RULE;
    type: ComponentType.RULE;
}

export interface TreeComponent extends Component {
    type: ComponentType.TREE;
    conclusion: number;
    marks?: number[];
    rule?: number;
    hypotheses?: number[];
    position?: Position;
}
