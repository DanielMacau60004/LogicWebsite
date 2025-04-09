import './App.css';

import {Board} from "./components/Board";

import React, {ReactNode, useState} from 'react';
import {Button, Col, Container, Dropdown, Row} from "react-bootstrap";

import "./Siderbar.css"
import {Element} from "./components/Components";
import {EComponentTypes} from "./store/components";

export function Sidebar() {
    const [fixed, setFixed] = useState(false);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        if (fixed) setOpen(!open)
        setFixed(!fixed);
    }

    const [show, setShow] = useState<string | undefined>(undefined);

    function HoverDropdown({type, children}: { type: string, children: ReactNode }) {
        const toggle = Array.isArray(children) ? children[0] : children;
        const items = Array.isArray(children) ? children.slice(1) : [];

        return (
            <Dropdown
                show={show === type}
                onMouseEnter={() => setShow(type)}
                onMouseLeave={() => setShow(undefined)}
                drop="end"
            >
                <Dropdown.Toggle variant="primary" className="sidebar-item no-caret">
                    {toggle}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {items.map((item, index) => (
                        <Dropdown.Item key={index}>{item}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <div className="sidebar" onMouseEnter={() => !fixed && setOpen(true)}
             onMouseLeave={() => !fixed && setOpen(false)}>
            <Button variant="primary" onClick={handleToggle}>
                T
            </Button>
            <hr/>

            <div className={"sidebar-content d-flex justify-content-center"}>
                <ul className={"px-0 m-0"}>
                    <li>
                        <HoverDropdown type={"marks"}>
                            <Element id={-1} type={EComponentTypes.MARK} value={"M"}/>
                            <Element id={-1} type={EComponentTypes.MARK} value={"M1"}/>
                            <Element id={-1} type={EComponentTypes.MARK} value={"M2"}/>
                            <Element id={-1} type={EComponentTypes.MARK} value={"M3"}/>
                            <Element id={-1} type={EComponentTypes.MARK} value={"M4"}/>
                            <Element id={-1} type={EComponentTypes.MARK} value={"M5"}/>
                        </HoverDropdown>


                    </li>
                    <li>
                        <HoverDropdown type={"rules"}>
                            <Element id={-2} type={EComponentTypes.RULE} value={"R"}/>
                            <Element id={-2} type={EComponentTypes.RULE} value={"R1"}/>
                            <Element id={-2} type={EComponentTypes.RULE} value={"R2"}/>
                            <Element id={-2} type={EComponentTypes.RULE} value={"R3"}/>
                        </HoverDropdown>
                    </li>
                    <li>
                        <HoverDropdown type={"exps"}>
                            <Element id={-3} type={EComponentTypes.EXP} value={"E"}/>
                            <Element id={-3} type={EComponentTypes.EXP} value={"Exp1"}/>
                            <Element id={-3} type={EComponentTypes.EXP} value={"Exp2"}/>
                            <Element id={-3} type={EComponentTypes.EXP} value={"Exp3"}/>
                            <Element id={-3} type={EComponentTypes.EXP} value={"Exp4"}/>
                            <Element id={-3} type={EComponentTypes.EXP} value={"Exp5"}/>
                            <Element id={-3} type={EComponentTypes.EXP} value={"Exp6"}/>
                            <Element id={-3} type={EComponentTypes.EXP} value={"Exp7"}/>
                        </HoverDropdown>
                    </li>
                    <li>
                        <Element id={-4} type={EComponentTypes.TREE}/>
                    </li>
                </ul>

            </div>
            {/* Collapse Sidebar
            <Collapse in={open} dimension={"width"} timeout={500}>
                <div className="sidebar-open">
                    <div className="sidebar-header">
                        <h5>Sidebar</h5>
                    </div>
                    <div className="sidebar-body">
                        <p>Here is the content inside the sidebar.</p>
                        <ul>
                            <li>
                                <Element id={-1} type={EComponentTypes.MARK} value={"1"}/>
                            </li>
                            <li>
                                <Element id={-2} type={EComponentTypes.RULE} value={"Rule"}/>
                            </li>
                            <li>
                                <Element id={-3} type={EComponentTypes.EXP} value={"Expression"}/>
                            </li>
                            <li>
                                <Element id={-4} type={EComponentTypes.TREE} value={"Expression"}/>
                            </li>
                        </ul>


                    </div>

                </div>
            </Collapse>
            */}
        </div>
    )
}

function App() {


    return (

        <Container fluid={true}>
            <Row>
                <Col className="col-auto p-0"><Sidebar/></Col>
                <Col className={"p-0"}><Board/></Col>
            </Row>

        </Container>


    );


}

export default App;