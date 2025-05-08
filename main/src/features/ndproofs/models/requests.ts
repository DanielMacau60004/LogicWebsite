import {ExpressionsControllerApi, NdProofsControllerApi} from "../../../api";


export async function testExpression(expression: string, isFOL: boolean): Promise<{isWFF: boolean, response: string} | undefined> {
    const api = new ExpressionsControllerApi()

    try {
        let response: any;
        if (isFOL) response = await api.verifyFOLExpression({ body: expression })
        else response =  await api.verifyPLExpression({ body: expression })


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

export async function testProof(proof: string, isFOL: boolean): Promise<{isWFP: boolean, response: string} | undefined> {
    const api = new NdProofsControllerApi()

    try {
        let response: any;
        if (isFOL) response = await api.verifyGeneralFOLProblem({ body: proof })
        else response =  await api.verifyGeneralPLProblem({ body: proof })

        return {isWFP: response.code === 200, response: response.result};

    } catch (error: any) {
        const text = await error?.response.text();
        try {
            const jsonResponse = JSON.parse(text);
            return {isWFP: false, response: jsonResponse.result};
        } catch (err) {
            return
        }
    }
}

export async function loadExercises(maxExercises: number, isFOL: boolean): Promise< string[][] | undefined> {
    const api = new NdProofsControllerApi()

    try {
        let response: any;
        response = isFOL
            ? await api.getFOLProblems({ pageable: { size: maxExercises } })
            : await api.getPLProblems({ pageable: { size: maxExercises } });

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