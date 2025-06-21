import {FaClone, FaTrash} from "react-icons/fa";
import React from "react";
import {CLONE_COMPONENT_ID, DELETE_COMPONENT_ID, SUBMIT_COMPONENT_ID} from "../../../constants";

export function TreeMenu() {

    return (
        <>
            <div className={"proof-properties top-right"}>
                <button id={DELETE_COMPONENT_ID} className={"proof-component"}><FaTrash size={20}/></button>
                <button id={CLONE_COMPONENT_ID} className={"proof-component"}><FaClone size={20}/></button>
            </div>

            <div className={"proof-properties bottom-center"}>
                <button id={SUBMIT_COMPONENT_ID} className={"proof-component proof-check"}>Check Proof</button>
            </div>
        </>
    )
}