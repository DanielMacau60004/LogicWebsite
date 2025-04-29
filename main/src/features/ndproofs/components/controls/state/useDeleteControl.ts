import {DroppableRender} from "../../../../../components/Droppable";

export function useDeleteControl() {
    const onRender = ({droppable, className, style}: DroppableRender) => {
        if (droppable.isOver)
            className += " trash-open"
        return {className, style};
    };

    return {onRender}
}
