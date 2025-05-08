import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {BoardAction} from "../../types/proofBoard";
import {copy, deleteComponent, paste, redo, switchFOL, switchHelpMode, undo} from "../../../../store/boardSlice";
import {KeyActionMap} from "../../constants";

export function useGeneralEvents() {
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
                case BoardAction.SwitchFOL:
                    dispatch(switchFOL())
                    break;
                case BoardAction.SwitchHelp:
                    dispatch(switchHelpMode())
                    break;
            }
        }

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [dispatch]);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);
}
