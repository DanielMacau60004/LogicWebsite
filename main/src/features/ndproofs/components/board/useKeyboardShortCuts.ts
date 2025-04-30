import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import {BoardAction} from "../../types/proofBoard";
import {copy, deleteComponent, paste, redo, setZoom, undo} from "../../../../store/boardSlice";
import {KeyActionMap} from "../../constants";
import {GlobalState} from "../../../../store";

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



    const state = useSelector((state: GlobalState) => state.board)
    // Clamp zoom value between 0.1 and 3

    // Mouse wheel zoom
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            dispatch(setZoom(delta))
        };

        document.addEventListener('wheel', handleWheel, { passive: false });
        return () => document.removeEventListener('wheel', handleWheel);

    }, []);


    const lastTouchDistance = useRef<number | null>(null);
    useEffect(() => {

        const getDistance = (touches: TouchList) => {
            const [a, b] = [touches[0], touches[1]];
            return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY); // Distance between two touches
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                lastTouchDistance.current = getDistance(e.touches); // Get initial pinch distance
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && lastTouchDistance.current != null) {
                const newDistance = getDistance(e.touches); // Get new pinch distance
                const delta = newDistance - lastTouchDistance.current; // Change in pinch distance
                const zoomChange = delta * 0.005; // Sensitivity factor for zoom
                dispatch(setZoom(zoomChange)) // Update zoom
                lastTouchDistance.current = newDistance; // Update last touch distance
            }
        };

        const handleTouchEnd = () => {
            lastTouchDistance.current = null; // Reset when touch ends
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, []);
}
