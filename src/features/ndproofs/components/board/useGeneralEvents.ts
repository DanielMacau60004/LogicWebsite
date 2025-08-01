import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {BoardAction} from "../../types/proofBoard";
import {
    copy,
    deleteComponent,
    paste,
    redo,
    switchFeedbackLevel,
    switchFOL,
    switchHelpMode,
    undo
} from "../../../../store/boardSlice";
import {KeyActionMap} from "../../constants";

export function useGeneralEvents() {
    const dispatch = useDispatch();

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            let prefix = '';
            if (event.ctrlKey) prefix += 'Ctrl+';
            if (event.shiftKey) prefix += 'Shift+';
            const key = prefix + event.code;
            const action = KeyActionMap.get(key);

            switch (action) {
                case BoardAction.Delete:
                    dispatch(deleteComponent({saveState: true}));
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
                case BoardAction.SwitchFeedbackLevel:
                    dispatch(switchFeedbackLevel())
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
