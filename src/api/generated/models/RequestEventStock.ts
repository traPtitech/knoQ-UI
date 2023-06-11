/* tslint:disable */
/* eslint-disable */
/**
 * traP knoQ
 * This is a sample knoQ server. 
 *
 * The version of the OpenAPI document: 2.1.3
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    RequestEventInstantTags,
    RequestEventInstantTagsFromJSON,
    RequestEventInstantTagsFromJSONTyped,
    RequestEventInstantTagsToJSON,
} from './';

/**
 * 既存の部屋を使う
 * @export
 * @interface RequestEventStock
 */
export interface RequestEventStock {
    /**
     * 
     * @type {string}
     * @memberof RequestEventStock
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof RequestEventStock
     */
    description: string;
    /**
     * 部屋の共用をするか
     * @type {boolean}
     * @memberof RequestEventStock
     */
    sharedRoom: boolean;
    /**
     * 
     * @type {string}
     * @memberof RequestEventStock
     */
    timeStart: string;
    /**
     * 
     * @type {string}
     * @memberof RequestEventStock
     */
    timeEnd: string;
    /**
     * 
     * @type {string}
     * @memberof RequestEventStock
     */
    roomId: string;
    /**
     * 
     * @type {string}
     * @memberof RequestEventStock
     */
    groupId: string;
    /**
     * グループ外のユーザーが参加予定を出来るか
     * @type {boolean}
     * @memberof RequestEventStock
     */
    open?: boolean;
    /**
     * 編集権を持つユーザー
     * @type {Array<string>}
     * @memberof RequestEventStock
     */
    admins: Array<string>;
    /**
     * 
     * @type {Array<RequestEventInstantTags>}
     * @memberof RequestEventStock
     */
    tags?: Array<RequestEventInstantTags>;
}

export function RequestEventStockFromJSON(json: any): RequestEventStock {
    return RequestEventStockFromJSONTyped(json, false);
}

export function RequestEventStockFromJSONTyped(json: any, ignoreDiscriminator: boolean): RequestEventStock {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'],
        'sharedRoom': json['sharedRoom'],
        'timeStart': json['timeStart'],
        'timeEnd': json['timeEnd'],
        'roomId': json['roomId'],
        'groupId': json['groupId'],
        'open': !exists(json, 'open') ? undefined : json['open'],
        'admins': json['admins'],
        'tags': !exists(json, 'tags') ? undefined : ((json['tags'] as Array<any>).map(RequestEventInstantTagsFromJSON)),
    };
}

export function RequestEventStockToJSON(value?: RequestEventStock | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'description': value.description,
        'sharedRoom': value.sharedRoom,
        'timeStart': value.timeStart,
        'timeEnd': value.timeEnd,
        'roomId': value.roomId,
        'groupId': value.groupId,
        'open': value.open,
        'admins': value.admins,
        'tags': value.tags === undefined ? undefined : ((value.tags as Array<any>).map(RequestEventInstantTagsToJSON)),
    };
}


