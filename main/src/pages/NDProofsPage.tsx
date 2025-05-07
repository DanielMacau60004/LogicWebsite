import {Board} from "../features/ndproofs/components/board/Board";
import {useSelector} from "react-redux";
import {GlobalState} from "../store";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function NDProofsPage() {
    const { exercise } = useSelector((state: GlobalState) => state.board);
    const navigate = useNavigate();

    useEffect(() => {
        if (!exercise || exercise.length === 0)
            navigate('/');
    }, [exercise, navigate]);

    return (
        <>
            <Board/>
        </>
    );
}

export default NDProofsPage;