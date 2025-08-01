/* tslint:disable */
/* eslint-disable */
/**
 * Logic Tool
 * API for managing the Logic Tool
 *
 * The version of the OpenAPI document: 1.0
 * Contact: dmacau@campus.fct.unl.pt
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  TreeComponent,
} from '../models/index';
import {
    TreeComponentFromJSON,
    TreeComponentToJSON,
} from '../models/index';

export interface ExpsFOLRequest {
    exps: Array<string>;
}

export interface ExpsPLRequest {
    exps: Array<string>;
}

export interface GetFOLProblemRequest {
    problemNum: number;
}

export interface GetFOLProblemsRequest {
    page?: number;
    size?: number;
}

export interface GetPLProblemRequest {
    problemNum: number;
}

export interface GetPLProblemsRequest {
    page?: number;
    size?: number;
}

export interface SolveFOLProblemRequest {
    problem: Array<string>;
}

export interface SolvePLProblemRequest {
    problem: Array<string>;
}

export interface VerifyFOLHintRequest {
    problem: Array<string>;
    goal: Array<string>;
    level: VerifyFOLHintLevelEnum;
}

export interface VerifyFOLProblemRequest {
    problem: Array<string>;
    level: VerifyFOLProblemLevelEnum;
    treeComponent: TreeComponent;
}

export interface VerifyGeneralFOLProblemRequest {
    level: VerifyGeneralFOLProblemLevelEnum;
    treeComponent: TreeComponent;
}

export interface VerifyGeneralPLProblemRequest {
    level: VerifyGeneralPLProblemLevelEnum;
    treeComponent: TreeComponent;
}

export interface VerifyPLHintRequest {
    problem: Array<string>;
    goal: Array<string>;
    level: VerifyPLHintLevelEnum;
}

export interface VerifyPLProblemRequest {
    problem: Array<string>;
    level: VerifyPLProblemLevelEnum;
    treeComponent: TreeComponent;
}

/**
 * 
 */
export class NdProofsControllerApi extends runtime.BaseAPI {

    /**
     */
    async expsFOLRaw(requestParameters: ExpsFOLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['exps'] == null) {
            throw new runtime.RequiredError(
                'exps',
                'Required parameter "exps" was null or undefined when calling expsFOL().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['exps'] != null) {
            queryParameters['exps'] = requestParameters['exps'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/fol/exps`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async expsFOL(requestParameters: ExpsFOLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.expsFOLRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async expsPLRaw(requestParameters: ExpsPLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['exps'] == null) {
            throw new runtime.RequiredError(
                'exps',
                'Required parameter "exps" was null or undefined when calling expsPL().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['exps'] != null) {
            queryParameters['exps'] = requestParameters['exps'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/pl/exps`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async expsPL(requestParameters: ExpsPLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.expsPLRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getFOLProblemRaw(requestParameters: GetFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problemNum'] == null) {
            throw new runtime.RequiredError(
                'problemNum',
                'Required parameter "problemNum" was null or undefined when calling getFOLProblem().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/fol/problem/{problemNum}`.replace(`{${"problemNum"}}`, encodeURIComponent(String(requestParameters['problemNum']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async getFOLProblem(requestParameters: GetFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getFOLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getFOLProblemsRaw(requestParameters: GetFOLProblemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['size'] != null) {
            queryParameters['size'] = requestParameters['size'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/fol/problem`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async getFOLProblems(requestParameters: GetFOLProblemsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getFOLProblemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getPLProblemRaw(requestParameters: GetPLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problemNum'] == null) {
            throw new runtime.RequiredError(
                'problemNum',
                'Required parameter "problemNum" was null or undefined when calling getPLProblem().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/pl/problem/{problemNum}`.replace(`{${"problemNum"}}`, encodeURIComponent(String(requestParameters['problemNum']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async getPLProblem(requestParameters: GetPLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getPLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getPLProblemsRaw(requestParameters: GetPLProblemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['size'] != null) {
            queryParameters['size'] = requestParameters['size'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/pl/problem`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async getPLProblems(requestParameters: GetPLProblemsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getPLProblemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async solveFOLProblemRaw(requestParameters: SolveFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problem'] == null) {
            throw new runtime.RequiredError(
                'problem',
                'Required parameter "problem" was null or undefined when calling solveFOLProblem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['problem'] != null) {
            queryParameters['problem'] = requestParameters['problem'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/fol/problem/solve`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async solveFOLProblem(requestParameters: SolveFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.solveFOLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async solvePLProblemRaw(requestParameters: SolvePLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problem'] == null) {
            throw new runtime.RequiredError(
                'problem',
                'Required parameter "problem" was null or undefined when calling solvePLProblem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['problem'] != null) {
            queryParameters['problem'] = requestParameters['problem'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/pl/problem/solve`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async solvePLProblem(requestParameters: SolvePLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.solvePLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async verifyFOLHintRaw(requestParameters: VerifyFOLHintRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problem'] == null) {
            throw new runtime.RequiredError(
                'problem',
                'Required parameter "problem" was null or undefined when calling verifyFOLHint().'
            );
        }

        if (requestParameters['goal'] == null) {
            throw new runtime.RequiredError(
                'goal',
                'Required parameter "goal" was null or undefined when calling verifyFOLHint().'
            );
        }

        if (requestParameters['level'] == null) {
            throw new runtime.RequiredError(
                'level',
                'Required parameter "level" was null or undefined when calling verifyFOLHint().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['problem'] != null) {
            queryParameters['problem'] = requestParameters['problem'];
        }

        if (requestParameters['goal'] != null) {
            queryParameters['goal'] = requestParameters['goal'];
        }

        if (requestParameters['level'] != null) {
            queryParameters['level'] = requestParameters['level'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/fol/hint`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async verifyFOLHint(requestParameters: VerifyFOLHintRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.verifyFOLHintRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async verifyFOLProblemRaw(requestParameters: VerifyFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problem'] == null) {
            throw new runtime.RequiredError(
                'problem',
                'Required parameter "problem" was null or undefined when calling verifyFOLProblem().'
            );
        }

        if (requestParameters['level'] == null) {
            throw new runtime.RequiredError(
                'level',
                'Required parameter "level" was null or undefined when calling verifyFOLProblem().'
            );
        }

        if (requestParameters['treeComponent'] == null) {
            throw new runtime.RequiredError(
                'treeComponent',
                'Required parameter "treeComponent" was null or undefined when calling verifyFOLProblem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['problem'] != null) {
            queryParameters['problem'] = requestParameters['problem'];
        }

        if (requestParameters['level'] != null) {
            queryParameters['level'] = requestParameters['level'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/nd/fol/problem`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TreeComponentToJSON(requestParameters['treeComponent']),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async verifyFOLProblem(requestParameters: VerifyFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.verifyFOLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async verifyGeneralFOLProblemRaw(requestParameters: VerifyGeneralFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['level'] == null) {
            throw new runtime.RequiredError(
                'level',
                'Required parameter "level" was null or undefined when calling verifyGeneralFOLProblem().'
            );
        }

        if (requestParameters['treeComponent'] == null) {
            throw new runtime.RequiredError(
                'treeComponent',
                'Required parameter "treeComponent" was null or undefined when calling verifyGeneralFOLProblem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['level'] != null) {
            queryParameters['level'] = requestParameters['level'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/nd/fol`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TreeComponentToJSON(requestParameters['treeComponent']),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async verifyGeneralFOLProblem(requestParameters: VerifyGeneralFOLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.verifyGeneralFOLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async verifyGeneralPLProblemRaw(requestParameters: VerifyGeneralPLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['level'] == null) {
            throw new runtime.RequiredError(
                'level',
                'Required parameter "level" was null or undefined when calling verifyGeneralPLProblem().'
            );
        }

        if (requestParameters['treeComponent'] == null) {
            throw new runtime.RequiredError(
                'treeComponent',
                'Required parameter "treeComponent" was null or undefined when calling verifyGeneralPLProblem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['level'] != null) {
            queryParameters['level'] = requestParameters['level'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/nd/pl`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TreeComponentToJSON(requestParameters['treeComponent']),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async verifyGeneralPLProblem(requestParameters: VerifyGeneralPLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.verifyGeneralPLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async verifyPLHintRaw(requestParameters: VerifyPLHintRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problem'] == null) {
            throw new runtime.RequiredError(
                'problem',
                'Required parameter "problem" was null or undefined when calling verifyPLHint().'
            );
        }

        if (requestParameters['goal'] == null) {
            throw new runtime.RequiredError(
                'goal',
                'Required parameter "goal" was null or undefined when calling verifyPLHint().'
            );
        }

        if (requestParameters['level'] == null) {
            throw new runtime.RequiredError(
                'level',
                'Required parameter "level" was null or undefined when calling verifyPLHint().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['problem'] != null) {
            queryParameters['problem'] = requestParameters['problem'];
        }

        if (requestParameters['goal'] != null) {
            queryParameters['goal'] = requestParameters['goal'];
        }

        if (requestParameters['level'] != null) {
            queryParameters['level'] = requestParameters['level'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/nd/pl/hint`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async verifyPLHint(requestParameters: VerifyPLHintRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.verifyPLHintRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async verifyPLProblemRaw(requestParameters: VerifyPLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters['problem'] == null) {
            throw new runtime.RequiredError(
                'problem',
                'Required parameter "problem" was null or undefined when calling verifyPLProblem().'
            );
        }

        if (requestParameters['level'] == null) {
            throw new runtime.RequiredError(
                'level',
                'Required parameter "level" was null or undefined when calling verifyPLProblem().'
            );
        }

        if (requestParameters['treeComponent'] == null) {
            throw new runtime.RequiredError(
                'treeComponent',
                'Required parameter "treeComponent" was null or undefined when calling verifyPLProblem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['problem'] != null) {
            queryParameters['problem'] = requestParameters['problem'];
        }

        if (requestParameters['level'] != null) {
            queryParameters['level'] = requestParameters['level'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/nd/pl/problem`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TreeComponentToJSON(requestParameters['treeComponent']),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     */
    async verifyPLProblem(requestParameters: VerifyPLProblemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.verifyPLProblemRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const VerifyFOLHintLevelEnum = {
    None: 'NONE',
    Low: 'LOW',
    Medium: 'MEDIUM',
    High: 'HIGH',
    Solution: 'SOLUTION'
} as const;
export type VerifyFOLHintLevelEnum = typeof VerifyFOLHintLevelEnum[keyof typeof VerifyFOLHintLevelEnum];
/**
 * @export
 */
export const VerifyFOLProblemLevelEnum = {
    None: 'NONE',
    Low: 'LOW',
    Medium: 'MEDIUM',
    High: 'HIGH',
    Solution: 'SOLUTION'
} as const;
export type VerifyFOLProblemLevelEnum = typeof VerifyFOLProblemLevelEnum[keyof typeof VerifyFOLProblemLevelEnum];
/**
 * @export
 */
export const VerifyGeneralFOLProblemLevelEnum = {
    None: 'NONE',
    Low: 'LOW',
    Medium: 'MEDIUM',
    High: 'HIGH',
    Solution: 'SOLUTION'
} as const;
export type VerifyGeneralFOLProblemLevelEnum = typeof VerifyGeneralFOLProblemLevelEnum[keyof typeof VerifyGeneralFOLProblemLevelEnum];
/**
 * @export
 */
export const VerifyGeneralPLProblemLevelEnum = {
    None: 'NONE',
    Low: 'LOW',
    Medium: 'MEDIUM',
    High: 'HIGH',
    Solution: 'SOLUTION'
} as const;
export type VerifyGeneralPLProblemLevelEnum = typeof VerifyGeneralPLProblemLevelEnum[keyof typeof VerifyGeneralPLProblemLevelEnum];
/**
 * @export
 */
export const VerifyPLHintLevelEnum = {
    None: 'NONE',
    Low: 'LOW',
    Medium: 'MEDIUM',
    High: 'HIGH',
    Solution: 'SOLUTION'
} as const;
export type VerifyPLHintLevelEnum = typeof VerifyPLHintLevelEnum[keyof typeof VerifyPLHintLevelEnum];
/**
 * @export
 */
export const VerifyPLProblemLevelEnum = {
    None: 'NONE',
    Low: 'LOW',
    Medium: 'MEDIUM',
    High: 'HIGH',
    Solution: 'SOLUTION'
} as const;
export type VerifyPLProblemLevelEnum = typeof VerifyPLProblemLevelEnum[keyof typeof VerifyPLProblemLevelEnum];
