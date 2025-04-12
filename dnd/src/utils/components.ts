export interface Position {
    x: number;
    y: number;
}

export enum EProof {
    EXP = 'EXP',
    RULE = 'RULE',
    MARK = 'MARK',
    TREE = 'TREE'
}

const dragMap = new Map<EProof, EProof>([
    [EProof.EXP, EProof.EXP],
    [EProof.TREE, EProof.EXP],
    [EProof.MARK, EProof.MARK],
    [EProof.RULE, EProof.RULE]
]);

export interface Component {
    id: number;
    type: EProof;
    parent?: number;
    position?: Position;

    [key: string]: any;
}

//Method responsible to check whether a component is contained in certain parent component
function containsParent(component: Component, parent: number, components: { [key: number]: Component }): boolean {
    while (component && component.id !== parent) {
        if (component.parent == null) break;
        component = components[component.parent];
    }
    return component?.id === parent
}

//Method responsible to compute possible drags
function containDragType(components: { [key: number]: Component }, dragging: Component, dropping: Component) : boolean {
    //Prevent trees from being dragged into the conclusion
    if(dropping.type === EProof.EXP && dragging.type === EProof.TREE && dropping.parent) {
        const parent = components[dropping.parent]
        return parent.conclusion !== dropping.id
    }

    return dragMap.get(dragging.type) === dropping.type
}

//Check whether a dragging component can be dropped into another
export function canDropComponent(components: { [key: number]: Component }, dragging?: Component, dropping?: Component): boolean {
    return (
        dragging !== undefined && dropping !== undefined &&
        dropping.parent !== undefined &&
        dragging.id !== dropping.id &&
        dragging.id !== dropping.parent &&
        containDragType(components, dragging, dropping) &&
        !containsParent(dropping, dragging.id, components)
    );
}

//Method responsible to reset a component to its initial state before being dragged
export function resetComponent(component: Component): Component {
    const {id, parent, type} = component;
    return {id, parent, type: dragMap.get(type) || type}
}



