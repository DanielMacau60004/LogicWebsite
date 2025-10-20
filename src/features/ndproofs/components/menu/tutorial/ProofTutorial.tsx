import Joyride from "react-joyride";
import { useProofTutorial } from "./useProofTutorial";
import "./ProofTutorial.scss"

export const ProofTutorial = () => {
    const { steps, run, stepIndex, handleJoyrideCallback } = useProofTutorial();

    return (
        <Joyride
            steps={steps}
            stepIndex={stepIndex}
            run={run}
            continuous
            showProgress
            hideBackButton
            disableOverlayClose={true}
            callback={handleJoyrideCallback}
            styles={{
                tooltip: {
                    width: 360,
                    maxWidth: "80vw",
                },
            }}
        />
    );
};
