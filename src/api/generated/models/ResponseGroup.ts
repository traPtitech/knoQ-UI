/* tslint:disable */
/* eslint-disable */
/**
 * traP knoQ
 * This is a sample knoQ server. 
 *
 * The version of the OpenAPI document: 2.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ResponseGroup
 */
export interface ResponseGroup {
    /**
     * 
     * @type {string}
     * @memberof ResponseGroup
     */
    groupId: string;
    /**
     * 
     * @type {string}
     * @memberof ResponseGroup
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ResponseGroup
     */
    description: string;
    /**
     * 
     * @type {boolean}
     * @memberof ResponseGroup
     */
    open: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ResponseGroup
     */
    isTraQGroup: boolean;
    /**
     * グループのメンバー
     * @type {Array<string>}
     * @memberof ResponseGroup
     */
    members: Array<string>;
    /**
     * 編集権を持つユーザー
     * @type {Array<string>}
     * @memberof ResponseGroup
     */
    admins: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ResponseGroup
     */
    createdBy: string;
    /**
     * 
     * @type {string}
     * @memberof ResponseGroup
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof ResponseGroup
     */
    updatedAt: string;
}

export function ResponseGroupFromJSON(json: any): ResponseGroup {
    return ResponseGroupFromJSONTyped(json, false);
}

export function ResponseGroupFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseGroup {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'groupId': json['groupId'],
        'name': json['name'],
        'description': json['description'],
        'open': json['open'],
        'isTraQGroup': json['isTraQGroup'],
        'members': json['members'],
        'admins': json['admins'],
        'createdBy': json['createdBy'],
        'createdAt': json['createdAt'],
        'updatedAt': json['updatedAt'],
    };
}

export function ResponseGroupToJSON(value?: ResponseGroup | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'groupId': value.groupId,
        'name': value.name,
        'description': value.description,
        'open': value.open,
        'isTraQGroup': value.isTraQGroup,
        'members': value.members,
        'admins': value.admins,
        'createdBy': value.createdBy,
        'createdAt': value.createdAt,
        'updatedAt': value.updatedAt,
    };
}


