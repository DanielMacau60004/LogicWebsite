import React, {useRef, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import "./NewProof.scss"
import { RiDeleteBin6Line } from "react-icons/ri";
import {ExpKeyboard} from "../keyboards/ExpKeyboard";
import {Keyboard, renderKeyButtons} from "../keyboards/Keyboard";

export function NewProof() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [premises, setPremises] = useState<string[]>([]);
    const [isFOL, setIsFOL] = useState(false);
    const [conclusion, setConclusion] = useState('');

    const addPremise = () => {
        setPremises([...premises, '']);
    };

    const removePremise = (index: number) => {
        setPremises(premises.filter((_, i) => i !== index));
    };

    const handlePremiseChange = (index: number, value: string) => {
        const updatedPremises = [...premises];
        updatedPremises[index] = value;
        setPremises(updatedPremises);
    };

    const handleConclusionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConclusion(event.target.value);
    };

    const handleFOLToggle = () => {
        setIsFOL(!isFOL);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} className={"add-btn"}>
                <FaPlus />
            </Button>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Exercise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <div className="ms-5">
                            <h5>First-Order Logic:
                            <Form.Check
                                type="switch"
                                id="fol-toggle"
                                className={"d-inline ms-3 fol-toggle"}
                                checked={isFOL}
                                onChange={handleFOLToggle}
                            />
                            </h5>
                        </div>

                        <div>
                            <h5>
                                <Button variant="primary" onClick={addPremise} className={"add-premise-btn me-2"}>
                                    <FaPlus />
                                </Button>
                                Premises:
                            </h5>
                            {premises.map((premise, index) => (
                                <div key={index} className="mb-2">
                                    <Button
                                        variant="danger"
                                        className="d-inline me-2"
                                        onClick={() => removePremise(index)}
                                    >
                                        <RiDeleteBin6Line />
                                    </Button>
                                    <Form.Control
                                        className={"d-inline w-75"}
                                        type="text"
                                        value={premise}
                                        onChange={(e) => handlePremiseChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="ms-5 w-75">
                            <h5>Conclusion:</h5>
                            <Form.Control
                                type="text"
                                value={conclusion}
                                onChange={handleConclusionChange}
                            />
                        </div>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose} className={"create-premise-btn"}>
                        Create
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
}