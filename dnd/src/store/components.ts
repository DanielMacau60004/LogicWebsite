export interface Position {
    x: number;
    y: number;
}

export function distance(p1: Position, p2: Position): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export enum EComponentTypes {
    EXP = 'EXP',
    RULE = 'RULE',
    MARK = 'MARK',
    TREE = 'TREE'
}

export interface Component {
    id: number;
    type: EComponentTypes;
    droppableTypes?: EComponentTypes[];
    parent?: number;
    value?: object;
    position?: Position;

    [key: string]: any;
}

export function createExpression(id: number, parent?: number, value?: object, position?: Position): Component {
    return {id, type: EComponentTypes.EXP, droppableTypes: [EComponentTypes.EXP, EComponentTypes.TREE], parent, value, position
    };
}

export function createMark(id: number, parent?: number, value?: object, position?: Position): Component {
    return {id, type: EComponentTypes.MARK, droppableTypes: [EComponentTypes.MARK], parent, value, position};
}

export function createRule(id: number, parent?: number, value?: object, position?: Position): Component {
    return {id, type: EComponentTypes.RULE, droppableTypes: [EComponentTypes.RULE], parent, value, position};
}

export function createTree(id: number, conclusion: number, rule: number, hypotheses: number[],
                           marks: number[], parent?: number, value?: object, position?: Position): Component {
    return {
        id, conclusion, rule, hypotheses, marks, type: EComponentTypes.TREE, droppableTypes: undefined,
        parent, value, position
    };
}

export function canDrop(dragging?: Component, dropping?: Component): boolean {
    return (
        dragging !== undefined && dropping !== undefined &&
        dragging.id !== dropping.id && dropping.droppableTypes?.includes(dragging.type) === true &&
             dragging.id !== dropping.parent
    );
}

export function reset(component: Component): Component {
    const {id, parent, type} = component;

    switch (type) {
        case EComponentTypes.EXP:
        case EComponentTypes.TREE:
            return createExpression(id, parent);
        case EComponentTypes.MARK:
            return createMark(id, parent);
        default:
            return createRule(id, parent);
    }
}



