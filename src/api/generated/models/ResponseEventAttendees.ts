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
/**
 * ユーザの参加状況
 * @export
 * @interface ResponseEventAttendees
 */
export interface ResponseEventAttendees {
    /**
     * 
     * @type {string}
     * @memberof ResponseEventAttendees
     */
    userId: string;
    /**
     * pending or absent or attendance
     * @type {string}
     * @memberof ResponseEventAttendees
     */
    schedule: ResponseEventAttendeesScheduleEnum;
}

/**
* @export
* @enum {string}
*/
export enum ResponseEventAttendeesScheduleEnum {
    Pending = 'pending',
    Absent = 'absent',
    Attendance = 'attendance'
}

export function ResponseEventAttendeesFromJSON(json: any): ResponseEventAttendees {
    return ResponseEventAttendeesFromJSONTyped(json, false);
}

export function ResponseEventAttendeesFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseEventAttendees {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['userId'],
        'schedule': json['schedule'],
    };
}

export function ResponseEventAttendeesToJSON(value?: ResponseEventAttendees | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'schedule': value.schedule,
    };
}


