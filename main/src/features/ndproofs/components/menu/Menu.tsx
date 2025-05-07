import "./Menu.scss"
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setExercise} from "../../../../store/boardSlice";

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
                const conclusion = exercise[exercise.length - 1]; // Last item is the conclusion
                const premises = exercise.slice(0, exercise.length - 1); // Rest are premises

                return (
                    <button
                        key={index}
                        className="exercise-name"
                        onClick={() => handleClick(exercise)} // Pass entire exercise to handleClick
                    >
                        {/* Render premises */}
                        {premises.length > 0 && (
                            <span>
                                {premises.map((premise, idx) => (
                                    <span key={idx}>{premise}{idx < premises.length - 1 && ', '}</span>
                                ))}
                            </span>
                        )}
                        {/* Render the conclusion */}
                        ⊢ {conclusion}
                    </button>
                );
            })}
        </>
    );
}


export function Menu() {

    const PLExercises = [
        ['φ → (φ ∨ ψ)'],
        ['(φ ∨ φ) → φ'],
        ['(φ ∧ ψ) → φ'],
        ['φ → (ψ → φ)'],
        ['((φ → ψ) ∧ (ψ → γ)) → (φ → γ)'],
        ['(φ → (ψ → γ)) → ((φ → ψ) → (φ → γ))'],
        ['(φ → ψ) → (φ → (ψ ∨ γ))'],
        ['(ψ → γ) → ((φ ∧ ψ) → γ)'],
        ['¬(φ ∨ ψ) → ¬φ'],
        ['(ψ → γ) → ((φ ∧ ψ) → (φ ∧ γ))'],
        ['¬φ ∨ ψ', 'φ → ψ'],
        ['φ → ψ', '¬φ ∨ ψ'],
        ['¬(φ ∧ ψ)', '¬φ ∨ ¬ψ'],
        ['¬φ ∨ ¬ψ', '¬(φ ∧ ψ)'],
        ['¬(φ ∨ ψ)', '¬φ ∧ ¬ψ'],
        ['¬φ ∧ ¬ψ', '¬(φ ∨ ψ)'],
        ['φ ∨ (ψ ∧ δ)', '(φ ∨ ψ) ∧ (φ ∨ δ)'],
        ['(φ ∨ ψ) ∧ (φ ∨ δ)', 'φ ∨ (ψ ∧ δ)'],
        ['φ ∧ (ψ ∨ δ)', '(φ ∧ ψ) ∨ (φ ∧ δ)'],
        ['(φ ∧ ψ) ∨ (φ ∧ δ)', 'φ ∧ (ψ ∨ δ)'],
        ['φ ↔ ψ', '(φ ∧ δ) ↔ (ψ ∧ δ)'],
        ['¬(¬φ ∨ ¬ψ)', 'φ ∧ ψ'],
    ];

    const FOLExercises = [
        ['∀x P(x) ∨ ∀x Q(x)', '∀x (P(x) ∨ Q(x))'],
        ['∀x (P(x) ∧ Q(x))', '∀x P(x) ∧ ∀x Q(x)'],
        ['∀x P(x) ∧ ∀x Q(x)', '∀x (P(x) ∧ Q(x))'],
        ['∃x (P(x) ∧ Q(x))', '∃x P(x) ∧ ∃x Q(x)'],
        ['∃x P(x) ∨ ∃x Q(x)', '∃x (P(x) ∨ Q(x))'],
        ['∃x (P(x) ∨ Q(x))', '∃x P(x) ∨ ∃x Q(x)'],
        ['∀x (P(x) → Q(x))', '∀x P(x) → ∀x Q(x)'],
        ['∃x (T(x) ∧ S(x))', '∀x (S(x) → L(x, b))', '∃x ∃y L(x, y)'],
        ['∀y (C(y) ∨ D(y))', '∀x (C(x) → L(x))', '∃x ¬L(x)', '∃x D(x)'],
        ['∀x (C(x) → S(x))', '∀x (¬A(x, b) → ¬S(x))', '∀x ((C(x) ∨ S(x)) → A(x, b))'],
        ['L(a, b)', '∀x (∃y (L(y, x) ∨ L(x, y)) → L(x, x))', '∃x L(x, a)'],
        ['∀x ∀y (L(x, y) → L(y, x))', '∃x ∀y L(x, y)', '∀x ∃y L(x, y)'],
        ['∀x (S(x) → C(x))', '∃x ¬C(x) → ∃x S(x)', '∃x C(x)'],
        ['¬∃x (T(x) ∧ S(x))', '∀y (S(y) ∨ M(y))', '∀x (T(x) → M(x))'],
    ];

    return (
        <Container fluid className={"menu"}>

            <Row className={"menu-content pt-lg-5 pt-3"}>
                <p className={"title"}>LOGIC TOOL</p>
                <Col className={"tab"}>
                    <p className={"title"}>PROPOSITIONAL</p>

                    <ExerciseComponent exercises={PLExercises} isFOL={false}/>
                </Col>

                <Col className={"tab"}>
                    <p className={"title"}>FIRST-ORDER</p>

                    <ExerciseComponent exercises={FOLExercises} isFOL={true}/>
                </Col>
            </Row>

            <p className="credits">© {new Date().getFullYear()} Daniel Macau. All rights reserved.</p>

        </Container>

    );
}