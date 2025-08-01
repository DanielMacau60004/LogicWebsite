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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface RuleComponent
 */
export interface RuleComponent {
    /**
     * 
     * @type {string}
     * @memberof RuleComponent
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof RuleComponent
     */
    value?: string;
}

/**
 * Check if a given object implements the RuleComponent interface.
 */
export function instanceOfRuleComponent(value: object): boolean {
    return true;
}

export function RuleComponentFromJSON(json: any): RuleComponent {
    return RuleComponentFromJSONTyped(json, false);
}

export function RuleComponentFromJSONTyped(json: any, ignoreDiscriminator: boolean): RuleComponent {
    if (json == null) {
        return json;
    }
    return {
        
        'type': json['type'] == null ? undefined : json['type'],
        'value': json['value'] == null ? undefined : json['value'],
    };
}

export function RuleComponentToJSON(value?: RuleComponent | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'type': value['type'],
        'value': value['value'],
    };
}

