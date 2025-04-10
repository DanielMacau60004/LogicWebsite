import React, {useState} from "react";
import {Button, Collapse, Dropdown} from "react-bootstrap";
import {DragStartEvent} from "@dnd-kit/core";
import {Element} from "./ProofObjects";
import {FaBars, FaTimes} from 'react-icons/fa';
import {sideBarComponents} from "../utils/init";
import {SideBarComponent, SideBarItemList} from "../utils/sidebar";
import {Component} from "../utils/components";


export function SideBar() {

    const [isOpen, setIsOpen] = useState(true);
    const [active, setActive] = useState<number | undefined>();
    const [show, setShow] = useState<string | undefined>();

    function SideBarItemList(list: SideBarItemList) {

        return (
            <Dropdown
                show={show === list.name}
                onMouseEnter={() => setShow(list.name)}
                onMouseLeave={() => setShow(undefined)}
                drop="end"
                className={"p-1"}
            >
                <Dropdown.Toggle variant="primary" className={`sidebar-item no-caret p-1 
                    ${show === list.name ? "sidebar-item-active" : ""}`}>
                    <Element {...list.icon}/>
                </Dropdown.Toggle>

                <Dropdown.Menu className={"sidebar-item-content"}>
                    <h5>{list.name}</h5>
                    {list.values.map((item) => (
                        <SideBarItem {...item}/>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    function SideBarItem(list: SideBarComponent) {
        return (
            <>
                {list.name && <h6>{list.name}</h6>}
                {list.list.map((component: Component, index) => (
                    <Dropdown.Item key={index}>
                        <Element {...component} />
                    </Dropdown.Item>
                ))}
            </>
        );
    }

    //TODO SHOULD BE CALLED
    function handleDragStart(event: DragStartEvent) {
        setActive(Number(event.active.id))
        setShow(undefined)
    }

    return (
        <div className="border shadow sidebar p-0 list-unstyled d-flex flex-column align-items-center">
            <Button className="icon p-3" aria-controls="sidebar-collapse" aria-expanded={isOpen} variant="link"
                    onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (<FaTimes size={25}/>) : (<FaBars size={25}/>)}
            </Button>

            <Collapse in={isOpen} className={"px-0 mb-2"}>
                <div id="sidebar-collapse" className={"sidebar-content"}>
                    <ul className={"px-0 m-0 d-flex flex-column align-items-center"}>
                        <hr/>
                        {sideBarComponents.map((item) =>
                            <li key={item.name}><SideBarItemList {...item}/></li>
                        )}
                    </ul>
                </div>
            </Collapse>
        </div>)
}