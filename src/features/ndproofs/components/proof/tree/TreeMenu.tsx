import {FaCheck, FaClone, FaSpinner, FaTrash} from "react-icons/fa";
import React from "react";
import {CLONE_COMPONENT_ID, DELETE_COMPONENT_ID, SUBMIT_COMPONENT_ID} from "../../../constants";

type TreeMenuProps = {
    hasErrors: boolean;
    isValid: boolean;
    isBeingSubmitted?: boolean;
    shouldCompareConclusion: boolean;
    solveCurrentExercise: boolean;
};

export function TreeMenu({
                             hasErrors,
                             isValid,
                             isBeingSubmitted,
                             shouldCompareConclusion,
                             solveCurrentExercise
                         }: TreeMenuProps) {
    const submitting = isBeingSubmitted ?? false;

    return (
        <>
            {/*} {isValid && (
                <div className="proof-properties top-center valid">
                    {solveCurrentExercise ? "Problem solved" : "Valid proof"}
                </div>
            )}

            {hasErrors && (
                <div className="proof-properties top-center invalid">
                    {"Errors found"}
                </div>
            )}*/}

            <div className="proof-properties left-center">
                <button id={DELETE_COMPONENT_ID} className="proof-component" title={"Delete"}>
                    <FaTrash size={20}/>
                </button>
                <button id={CLONE_COMPONENT_ID} className="proof-component" title={"Duplicate"}>
                    <FaClone size={20}/>
                </button>
            </div>

            <div className="proof-properties bottom-right">
                <button
                    id={SUBMIT_COMPONENT_ID} title="Submit"
                    className={`proof-component proof-check if ${isValid ? "valid" : ""}`}
                >
                    {submitting ? (
                        <FaSpinner className="spin"/>
                    ) : (
                        <FaCheck size={20}/>
                    )}
                </button>
            </div>
        </>
    );
}