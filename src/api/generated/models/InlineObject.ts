/* tslint:disable */
/* eslint-disable */
/**
 * traP knoQ
 * This is a sample knoQ server. 
 *
 * The version of the OpenAPI document: 2.0.0
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
 * @interface InlineObject
 */
export interface InlineObject {
    /**
     * 
     * @type {string}
     * @memberof InlineObject
     */
    subject?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineObject
     */
    startDate?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineObject
     */
    endDate?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineObject
     */
    startTime?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineObject
     */
    endTime?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineObject
     */
    location?: string;
}

export function InlineObjectFromJSON(json: any): InlineObject {
    return InlineObjectFromJSONTyped(json, false);
}

export function InlineObjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineObject {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'subject': !exists(json, 'Subject') ? undefined : json['Subject'],
        'startDate': !exists(json, 'Start date') ? undefined : json['Start date'],
        'endDate': !exists(json, 'End date') ? undefined : json['End date'],
        'startTime': !exists(json, 'Start time') ? undefined : json['Start time'],
        'endTime': !exists(json, 'End time') ? undefined : json['End time'],
        'location': !exists(json, 'Location') ? undefined : json['Location'],
    };
}

export function InlineObjectToJSON(value?: InlineObject | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'Subject': value.subject,
        'Start date': value.startDate,
        'End date': value.endDate,
        'Start time': value.startTime,
        'End time': value.endTime,
        'Location': value.location,
    };
}

