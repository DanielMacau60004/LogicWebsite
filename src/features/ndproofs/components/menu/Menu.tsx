import "./Menu.scss"
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setExercise} from "../../../../store/boardSlice";
import {useEffect, useState} from "react";
import {loadExercises} from "../../services/requests";
import {NewProof} from "./NewProof";

interface ExerciseComponentProps {
    exercises: string[][];
    isFOL: boolean;
}

function ExerciseComponent({ exercises, isFOL }: ExerciseComponentProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = (exercise: string[]) => {
        dispatch(setExercise({ exercise, isFOL }));
        navigate(`/exercise`);
    };

    return (
        <>
            {exercises.map((exercise, index) => {
                const conclusion = exercise[exercise.length - 1];
                const premises = exercise.slice(0, exercise.length - 1);

                return (
                    <button
                        key={index}
                        className="exercise-name"
                        onClick={() => handleClick(exercise)}
                    >
                        {premises.length > 0 && (
                            <span>
                                {premises.map((premise, idx) => (
                                    <span key={idx}>{premise}{idx < premises.length - 1 && ', '}</span>
                                ))}
                            </span>
                        )}
                        ⊢ {conclusion}
                    </button>
                );
            })}
        </>
    );
}

export function Menu() {

    const [PLExercises, setPLExercises] = useState<string[][]>([]);
    const [FOLExercises, setFOLExercises] = useState<string[][]>([]);

    useEffect(() => {
        async function fetchExercises() {
            const plData = await loadExercises(200, false);
            if (plData) setPLExercises(plData);

            const folData = await loadExercises(200, true);
            if (folData) setFOLExercises(folData);
        }

        fetchExercises();
    }, []);

    return (
        <Container fluid className={"menu"}>
            <Row className={"menu-content pt-lg-5 pt-3"}>
                <p className={"title"}>LOGIC TOOL</p>

                <Col className={"tab col-12"}>
                    <p className={"title"}>PROPOSITIONAL</p>

                    <ExerciseComponent exercises={PLExercises} isFOL={false}/>
                </Col>

                <Col className={"tab col-12"}>
                    <p className={"title"}>FIRST-ORDER</p>

                    <ExerciseComponent exercises={FOLExercises} isFOL={true}/>
                </Col>
            </Row>
            <p className="credits">© {new Date().getFullYear()} Daniel Macau. All rights reserved.</p>

        </Container>

    );
}