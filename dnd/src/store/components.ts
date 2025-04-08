export interface Position {
    x: number;
    y: number;
}

export function distance(p1: Position, p2: Position): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export interface Component {
    id: number;
    type: string;
    draggable: boolean;
    droppable: boolean;
    parent?: number;
    value?: object;
    position?: Position;

    [key: string]: any;
}

export function createExpression(id: number, parent?: number, value?: object, position?: Position): Component {
    return {id, type: "exp", draggable: true, droppable: true, parent, value, position};
}

export function createMark(id: number, parent?: number, value?: object, position?: Position): Component {
    return {id, type: "mark", draggable: true, droppable: true, parent, value, position};
}

export function createRule(id: number, parent?: number, value?: object, position?: Position): Component {
    return {id, type: "rule", draggable: true, droppable: true, parent, value, position};
}

export function createTree(id: number, conclusion: number, rule: number, hypotheses: number[],
                           marks: number[], parent?: number, value?: object, position?: Position): Component {
    return {
        id, conclusion, rule, hypotheses, marks, type: "tree", draggable: true, droppable: true,
        parent, value, position
    };
}

export function canDrop(dragging?: Component, dropping?: Component): boolean {
    if(dragging == null || dropping == null) return  false

    if(dragging.type !== dropping.type)
        return  false
    //if(dragging.type !== dropping.type && !(dragging.type === "tree" && dropping.type === "exp"))
    //    return  false
    return dragging.id !== dropping.id;
}

export function reset(component: Component): Component {
    const { id, parent, type } = component;

    switch (type) {
        case 'exp':
        case 'tree':
            return createExpression(id, parent);
        case 'mark':
            return createMark(id, parent);
        default:
            return createRule(id, parent);
    }
}



