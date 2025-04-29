import React, {useEffect, useState} from "react";
import {Button, Collapse, Dropdown} from "react-bootstrap";
import {FaBars, FaTimes} from 'react-icons/fa';
import {useSelector} from "react-redux";
import {SideBarComponent, SideBarComponentList} from "../../types/proofSidebar";
import {GlobalState} from "../../../../store";
import "./Sidebar.scss"
import {TreeComponent} from "../../types/proofBoard";
import {Tree} from "../proof/tree/Tree";

export function SideBarItem({ name, list }: SideBarComponent) {
    const {components} = useSelector((state: GlobalState) => state.board);
    return (
        <>
            {name && <h6>{name}</h6>}
            {list.map((component: TreeComponent, index) => (
                <Dropdown.Item key={index}>
                    <Tree tree={components[component.id] as TreeComponent} />
                </Dropdown.Item>
            ))}
        </>
    );
}

export interface SideBarItemListProps extends SideBarComponentList {
    show?: string;
    onShowChange: (name?: string) => void;
}

export function SideBarItemList(
    {
        name,
        icon,
        values,
        show,
        onShowChange,
    }: SideBarItemListProps) {
    const {drag, components} = useSelector((state: GlobalState) => state.board);
    const isActive = show === name && drag === undefined;

    return (
        <Dropdown
            show={isActive}
            onTouchStart={() => onShowChange(name)}
            onMouseEnter={() => onShowChange(name)}
            //onMouseLeave={() => onShowChange(undefined)}
            drop="end"
            className="p-1"
        >
            <Dropdown.Toggle
                variant="primary"
                className={`sidebar-item no-caret p-1 ${
                    isActive ? 'sidebar-item-active' : ''
                }`}
            >
                <Tree tree={components[icon.id] as TreeComponent} />
            </Dropdown.Toggle>

            <Dropdown.Menu className="sidebar-item-content">
                <h5>{name}</h5>
                {values.map((item, index) => (
                    <SideBarItem key={index} {...item} />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export function SideBar() {
    const { drag } = useSelector((state: GlobalState) => state.board);
    const [isOpen, setIsOpen] = useState(true);
    const [show, setShow] = useState<string | undefined>();

    useEffect(() => {
        if (drag === undefined) setShow(undefined);
    }, [drag]);

    return (
        <div className="border shadow sidebar p-0 list-unstyled d-flex flex-column align-items-center">
            <Button
                className="icon p-3"
                aria-expanded={isOpen}
                variant="link"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
            </Button>

            <Collapse in={isOpen} className="px-0 mb-2" timeout={0}>
                <div id="sidebar-collapse" className="sidebar-content">
                    <ul className="px-0 m-0 d-flex flex-column align-items-center">
                        <hr />
                        {/*sideBarItems.map((item: SideBarComponentList) => (
                            <li key={item.name}>
                                <SideBarItemList
                                    {...item}
                                    show={show}
                                    onShowChange={setShow}
                                />
                            </li>
                        ))*/}
                    </ul>
                </div>
            </Collapse>
        </div>
    );
}
