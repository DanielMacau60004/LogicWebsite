import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {KeyActionMap} from "../../models/proofBoard";
import {BoardAction} from "../../types/proofBoard";
import {copy, deleteComponent, paste, redo, undo} from "../../../../store/boardSlice";

export function useKeyboardShortCuts() {
    const dispatch = useDispatch();

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            const key = event.ctrlKey ? `Ctrl+${event.code}` : event.code;
            const action = KeyActionMap.get(key);

            switch (action) {
                case BoardAction.Delete:
                    dispatch(deleteComponent());
                    break;
                case BoardAction.Undo:
                    dispatch(undo());
                    break;
                case BoardAction.Redo:
                    dispatch(redo());
                    break;
                case BoardAction.Copy:
                    dispatch(copy());
                    break;
                case BoardAction.Paste:
                    dispatch(paste());
                    break;
            }
        }

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [dispatch]);
}
