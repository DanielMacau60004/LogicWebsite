import {FaClone, FaTrash} from "react-icons/fa";
import React from "react";
import {CLONE_COMPONENT_ID, DELETE_COMPONENT_ID, SUBMIT_COMPONENT_ID} from "../../../constants";

type TreeMenuProps = {
    hasErrors: boolean;
    isValid: boolean;
    shouldCompareConclusion: boolean;
    solveCurrentExercise: boolean;
};

export function TreeMenu({ hasErrors, isValid, shouldCompareConclusion, solveCurrentExercise }: TreeMenuProps) {

    return (
        <>
            {isValid && (
                <div className="proof-properties top-center valid">
                    {solveCurrentExercise ? "Problem solved" : "Valid proof"}
                </div>
            )}

            {hasErrors && (
                <div className="proof-properties top-center invalid">
                    {"Errors found"}
                </div>
            )}

            <div className="proof-properties top-right">
                <button id={DELETE_COMPONENT_ID} className="proof-component" title={"Delete"}>
                <FaTrash size={20} />
                </button>
                <button id={CLONE_COMPONENT_ID} className="proof-component" title={"Duplicate"}>
                    <FaClone size={20} />
                </button>
            </div>

            <div className="proof-properties bottom-center">
                <button id={SUBMIT_COMPONENT_ID} className="proof-component proof-check">
                    {shouldCompareConclusion ? "Check" : "Check"}
                </button>
            </div>
        </>
    );
}