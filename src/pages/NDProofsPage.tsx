import { Board } from "../features/ndproofs/components/board/Board";
import { useSelector } from "react-redux";
import { GlobalState } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {ProofTutorial} from "../features/ndproofs/components/menu/tutorial/ProofTutorial";

function NDProofsPage() {
    const state = useSelector((state: GlobalState) => state.board);
    const navigate = useNavigate();

    useEffect(() => {
        if (!state.exercise || state.exercise.length === 0) navigate("/");
    }, [state.exercise, navigate]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div>
            <ProofTutorial />
            <Board />
        </div>
    );
}

export default NDProofsPage;
