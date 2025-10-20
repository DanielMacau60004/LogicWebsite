import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {steps} from "./Steps";
import {CallBackProps} from "react-joyride";
import {GlobalState} from "../../../../../store";
import {drawContainmentBox} from "./Utils";

export function useProofTutorial() {
    let state = useSelector((state: GlobalState) => state.board);
    const dispatch: any = useDispatch();

    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    // Start tutorial after short delay
    useEffect(() => {
        const tutorialShown = sessionStorage.getItem("proofTutorialShown");
        if (!tutorialShown) {
            const timer = setTimeout(() => {
                setRun(true);
                sessionStorage.setItem("proofTutorialShown", "true");
            }, 800);
            return () => clearTimeout(timer);
        }
    }, []);


    useEffect(() => {
        if (!run) return; // only block events when tutorial is running

        const preventInteraction = (e: Event) => {

            const joyrideStep = document.querySelector(".react-joyride__tooltip") as HTMLElement;

            if (joyrideStep) {
                const skipButton = joyrideStep.querySelector('[data-test-id="button-close"]') as HTMLElement | null;
                if (skipButton && skipButton.contains(e.target as Node)) return;

                const nextButton = joyrideStep.querySelector('[data-test-id="button-primary"]') as HTMLElement | null;
                if (nextButton && nextButton.contains(e.target as Node)) return;
            }

            e.stopPropagation();
            e.preventDefault();
        };

        // Block clicks, touches, and keyboard input
        window.addEventListener("click", preventInteraction, true);
        window.addEventListener("mousedown", preventInteraction, true);
        window.addEventListener("touchstart", preventInteraction, true);
        window.addEventListener("keydown", preventInteraction, true);
        window.addEventListener("focusout", preventInteraction, true);

        return () => {
            window.removeEventListener("click", preventInteraction, true);
            window.removeEventListener("mousedown", preventInteraction, true);
            window.removeEventListener("touchstart", preventInteraction, true);
            window.removeEventListener("keydown", preventInteraction, true);
            window.removeEventListener("focusout", preventInteraction, true);
        };
    }, [run]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const {action, index, type, status, origin} = data;
        if (type === "step:after") {
            if (action === "next") {
                if (index < steps.length) {
                    const stepData = steps[index + 1]?.data;

                    if (stepData?.onStart) stepData.onStart(dispatch, state);

                    if (stepData?.targets) {
                        setTimeout(() => {
                            drawContainmentBox(
                                stepData.targets,
                                String(steps[index + 1].target),
                                steps[index + 1].spotlightPadding
                            );
                        }, 10);
                    }

                    setTimeout(() => {
                        setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
                        if(steps.length === index + 1)
                            setRun(false);
                    }, 20);
                } else setRun(false);
            } else if (action === "skip") {
                setRun(false);
            }
        }

        if (status === "finished" || status === "skipped" || origin === "button_close")
            setRun(false);

    };

    return {
        steps,
        run,
        stepIndex,
        handleJoyrideCallback,
    };
}
