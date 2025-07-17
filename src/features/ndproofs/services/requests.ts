import {ExpressionsControllerApi, NdProofsControllerApi} from "../../../api";
import {PreviewTreeComponent} from "../types/proofBoard";
import {FeedbackLevel} from "../types/feedback";


export async function testExpression(expression: string, isFOL: boolean, feedBack: FeedbackLevel): Promise<any | undefined> {
    const api = new ExpressionsControllerApi()

    try {
        let response: any;
        if (isFOL) response = await api.verifyFOLExpression({body: expression, level: feedBack})
        else response = await api.verifyPLExpression({body: expression, level: feedBack})
        return response.result;
    } catch (error: any) {
        console.log(error)
        return
    }
}

export async function testProof(proof: PreviewTreeComponent, isFOL: boolean, exercise: string[], shouldCompareConclusion: boolean
    , feedBack: FeedbackLevel): Promise<{ response: any } | undefined> {
    const api = new NdProofsControllerApi()

    try {
        let response: any;

        if (shouldCompareConclusion) {
            if (isFOL) response = await api.verifyFOLProblem({treeComponent: proof, problem: exercise, level: feedBack})
            else response = await api.verifyPLProblem({treeComponent: proof, problem: exercise, level: feedBack})
        } else {
            if (isFOL) response = await api.verifyGeneralFOLProblem({treeComponent: proof, level: feedBack})
            else response = await api.verifyGeneralPLProblem({treeComponent: proof, level: feedBack})
        }

        return {response: response.result};
    } catch (error: any) {
        console.log(error)
        return
    }
}

export async function solveProblem(exercise: string[], isFOL: boolean, feedBack: FeedbackLevel): Promise<PreviewTreeComponent | undefined> {
    const api = new NdProofsControllerApi()

    try {
        let response: any;
        if (isFOL) response = await api.solveFOLProblem({problem: exercise})
        else response = await api.solvePLProblem({problem: exercise})

        return response.result.proof as PreviewTreeComponent;

    } catch (error: any) {
        console.log(error)
        return
    }
}

export async function getHint(exercise: string[], goal: string[], isFOL: boolean, feedBack: FeedbackLevel): Promise<string> {
    const api = new NdProofsControllerApi()

    try {
        let response: any;
        if (isFOL) response = await api.verifyFOLHint({problem: exercise, goal: goal, level: feedBack})
        else response = await api.verifyPLHint({problem: exercise, goal: goal, level: feedBack})

        return response.result as string;

    } catch (error: any) {
        console.log(error)
        return "Failed to load hint!"
    }
}

export async function loadExercises(maxExercises: number, isFOL: boolean): Promise<string[][] | undefined> {
    const api = new NdProofsControllerApi()

    try {
        let response: any;
        response = isFOL
            ? await api.getFOLProblems({size: maxExercises})
            : await api.getPLProblems({size: maxExercises});

        if (response.result) {
            const problems = response.result.content;

            return problems.map((item: any) => {
                return [...item.premises, item.conclusion];
            });

        }

    } catch (error: any) {
        return
    }
}