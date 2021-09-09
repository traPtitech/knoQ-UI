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


import * as runtime from '../runtime';
import {
    InlineObject,
    InlineObjectFromJSON,
    InlineObjectToJSON,
    RequestRoom,
    RequestRoomFromJSON,
    RequestRoomToJSON,
    ResponseRoom,
    ResponseRoomFromJSON,
    ResponseRoomToJSON,
} from '../models';

export interface AddAllRoomsRequest {
    inlineObject: Array<InlineObject>;
}

export interface AddRoomsRequest {
    requestRoom: RequestRoom;
}

export interface DeleteRoomRequest {
    roomID: string;
}

export interface GetRoomRequest {
    roomID: string;
}

export interface GetRoomsRequest {
    dateBegin?: string;
    dateEnd?: string;
}

export interface UnverifyRoomRequest {
    roomID: string;
}

export interface VerifyRoomRequest {
    roomID: string;
}

/**
 * 
 */
export class RoomsApi extends runtime.BaseAPI {

    /**
     * 特権が必要。
     * traPで確保した部屋の情報追加
     */
    async addAllRoomsRaw(requestParameters: AddAllRoomsRequest): Promise<runtime.ApiResponse<Array<ResponseRoom>>> {
        if (requestParameters.inlineObject === null || requestParameters.inlineObject === undefined) {
            throw new runtime.RequiredError('inlineObject','Required parameter requestParameters.inlineObject was null or undefined when calling addAllRooms.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'text/csv';

        const response = await this.request({
            path: `/rooms/all`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.inlineObject.map(InlineObjectToJSON),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ResponseRoomFromJSON));
    }

    /**
     * 特権が必要。
     * traPで確保した部屋の情報追加
     */
    async addAllRooms(requestParameters: AddAllRoomsRequest): Promise<Array<ResponseRoom>> {
        const response = await this.addAllRoomsRaw(requestParameters);
        return await response.value();
    }

    /**
     * 部屋の情報追加
     * 部屋の情報追加
     */
    async addRoomsRaw(requestParameters: AddRoomsRequest): Promise<runtime.ApiResponse<ResponseRoom>> {
        if (requestParameters.requestRoom === null || requestParameters.requestRoom === undefined) {
            throw new runtime.RequiredError('requestRoom','Required parameter requestParameters.requestRoom was null or undefined when calling addRooms.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/rooms`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RequestRoomToJSON(requestParameters.requestRoom),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseRoomFromJSON(jsonValue));
    }

    /**
     * 部屋の情報追加
     * 部屋の情報追加
     */
    async addRooms(requestParameters: AddRoomsRequest): Promise<ResponseRoom> {
        const response = await this.addRoomsRaw(requestParameters);
        return await response.value();
    }

    /**
     * (関連する予約を削除する) エラーを出して削除を促す予定
     * 部屋の情報を削除
     */
    async deleteRoomRaw(requestParameters: DeleteRoomRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.roomID === null || requestParameters.roomID === undefined) {
            throw new runtime.RequiredError('roomID','Required parameter requestParameters.roomID was null or undefined when calling deleteRoom.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/rooms/{roomID}`.replace(`{${"roomID"}}`, encodeURIComponent(String(requestParameters.roomID))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * (関連する予約を削除する) エラーを出して削除を促す予定
     * 部屋の情報を削除
     */
    async deleteRoom(requestParameters: DeleteRoomRequest): Promise<void> {
        await this.deleteRoomRaw(requestParameters);
    }

    /**
     * 一件取得する
     * 一件取得する
     */
    async getRoomRaw(requestParameters: GetRoomRequest): Promise<runtime.ApiResponse<ResponseRoom>> {
        if (requestParameters.roomID === null || requestParameters.roomID === undefined) {
            throw new runtime.RequiredError('roomID','Required parameter requestParameters.roomID was null or undefined when calling getRoom.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/rooms/{roomID}`.replace(`{${"roomID"}}`, encodeURIComponent(String(requestParameters.roomID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseRoomFromJSON(jsonValue));
    }

    /**
     * 一件取得する
     * 一件取得する
     */
    async getRoom(requestParameters: GetRoomRequest): Promise<ResponseRoom> {
        const response = await this.getRoomRaw(requestParameters);
        return await response.value();
    }

    /**
     * 進捗部屋の情報を取得
     * 進捗部屋の情報を取得
     */
    async getRoomsRaw(requestParameters: GetRoomsRequest): Promise<runtime.ApiResponse<Array<ResponseRoom>>> {
        const queryParameters: any = {};

        if (requestParameters.dateBegin !== undefined) {
            queryParameters['dateBegin'] = requestParameters.dateBegin;
        }

        if (requestParameters.dateEnd !== undefined) {
            queryParameters['dateEnd'] = requestParameters.dateEnd;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/rooms`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ResponseRoomFromJSON));
    }

    /**
     * 進捗部屋の情報を取得
     * 進捗部屋の情報を取得
     */
    async getRooms(requestParameters: GetRoomsRequest): Promise<Array<ResponseRoom>> {
        const response = await this.getRoomsRaw(requestParameters);
        return await response.value();
    }

    /**
     * 特権が必要。部屋が使用できることの確認を取り消す。
     * 部屋を未確認にする
     */
    async unverifyRoomRaw(requestParameters: UnverifyRoomRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.roomID === null || requestParameters.roomID === undefined) {
            throw new runtime.RequiredError('roomID','Required parameter requestParameters.roomID was null or undefined when calling unverifyRoom.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/rooms/{roomID}/verified`.replace(`{${"roomID"}}`, encodeURIComponent(String(requestParameters.roomID))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * 特権が必要。部屋が使用できることの確認を取り消す。
     * 部屋を未確認にする
     */
    async unverifyRoom(requestParameters: UnverifyRoomRequest): Promise<void> {
        await this.unverifyRoomRaw(requestParameters);
    }

    /**
     * 特権が必要。部屋が使用できることを確認する
     * 部屋を確認する
     */
    async verifyRoomRaw(requestParameters: VerifyRoomRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.roomID === null || requestParameters.roomID === undefined) {
            throw new runtime.RequiredError('roomID','Required parameter requestParameters.roomID was null or undefined when calling verifyRoom.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/rooms/{roomID}/verified`.replace(`{${"roomID"}}`, encodeURIComponent(String(requestParameters.roomID))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * 特権が必要。部屋が使用できることを確認する
     * 部屋を確認する
     */
    async verifyRoom(requestParameters: VerifyRoomRequest): Promise<void> {
        await this.verifyRoomRaw(requestParameters);
    }

}
