import {ExpressionsControllerApi, NdProofsControllerApi} from "../../../api";
import {PreviewTreeComponent} from "../types/proofBoard";
import {FeedbackLevel} from "../types/feedback";


export async function testExpression(expression: string, isFOL: boolean, feedBack: FeedbackLevel): Promise<{
    isWFF: boolean,
    response: string
} | undefined> {
    const api = new ExpressionsControllerApi()

    try {
        let response: any;
        if (isFOL) response = await api.verifyFOLExpression({body: expression, level: feedBack})
        else response = await api.verifyPLExpression({body: expression, level: feedBack})


        return {isWFF: response.code === 200, response: response.result.exp};
    } catch (error: any) {
        const text = await error?.response.text();
        try {
            const jsonResponse = JSON.parse(text);
            return {isWFF: false, response: jsonResponse.result};
        } catch (err) {
            return
        }
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

        console.log(response)
        return {response: response.result};
    } catch (error: any) {
        if(!error) return

        const text = await error?.response.text();
        try {
            const jsonResponse = JSON.parse(text);
            return {response: jsonResponse.result};
        } catch (err) {
            return
        }
    }
}

export async function solveProblem(exercise: string[], isFOL: boolean, feedBack: FeedbackLevel): Promise<PreviewTreeComponent | undefined> {
    const api = new NdProofsControllerApi()

    try {
        let response: any;
        if (isFOL) response = await api.solveFOLProblem({problem: exercise, level: feedBack})
        else response = await api.solvePLProblem({problem: exercise, level: feedBack})

        console.log(response.result.proof)
        return response.result.proof as PreviewTreeComponent;

    } catch (error: any) {
        const text = await error?.response.text();
        console.log(text)
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