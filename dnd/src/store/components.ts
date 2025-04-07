export interface Position {
    x: number;
    y: number;
}

export class Point implements Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distance(other: Position): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

}

export interface Component {
    id: number;
    position?: Position;
    value?: object;
    parent?: number;
    draggable: boolean,
    droppable: boolean,

    [key: string]: any;
}

abstract class BaseComponent implements Component {
    id: number;
    position?: Position;
    value?: object;
    parent?: number;
    draggable: boolean;
    droppable: boolean;

    protected constructor(id: number, draggable: boolean, droppable: boolean,
                          position?: Position, value?: object, parent?: number) {
        this.id = id;
        this.draggable = draggable;
        this.droppable = droppable;
        this.position = position;
        this.value = value;
        this.parent = parent;

    }

    canDrop(other?: Component): boolean {
        return other ? this.constructor === other.constructor && this.id !== other.id : false;
    }
}

export class Expression extends BaseComponent {
    constructor(id: number, position?: Position, value?: object, parent?: number,
    ) {
        super(id, true, true, position, value, parent)
    }
}

export class Mark extends BaseComponent {
    constructor(id: number, position?: Position, value?: object, parent?: number,
    ) {
        super(id, true, true, position, value, parent)
    }
}

export class Rule extends BaseComponent {
    constructor(id: number, position?: Position, value?: object, parent?: number,
    ) {
        super(id, true, true, position, value, parent)
    }
}

export class Tree extends BaseComponent {
    conclusion: number[];
    rule: number;
    marks: number[];

    constructor(
        id: number,
        conclusion: number[],
        rule: number,
        marks: number[],
        position?: Position,
        value?: object,
        parent?: number
    ) {
        super(id, true, false, position, value, parent);
        this.conclusion = conclusion;
        this.rule = rule;
        this.marks = marks;
    }
}
