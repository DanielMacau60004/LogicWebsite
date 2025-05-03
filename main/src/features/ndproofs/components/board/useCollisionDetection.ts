import {Active, ClientRect, DroppableContainer, pointerWithin, rectIntersection} from "@dnd-kit/core";
import {RectMap} from "@dnd-kit/core/dist/store";
import {Coordinates} from "@dnd-kit/core/dist/types";

export function useCollisionDetection() {
    return (args: {
        active: Active;
        collisionRect: ClientRect;
        droppableRects: RectMap;
        droppableContainers: DroppableContainer[];
        pointerCoordinates: Coordinates | null;
    }) => {
        const collisions = pointerWithin(args);
        return collisions.length > 0 ? collisions : rectIntersection(args);
    };
}