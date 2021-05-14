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


import * as runtime from '../runtime';
import {
    RequestGroup,
    RequestGroupFromJSON,
    RequestGroupToJSON,
    ResponseGroup,
    ResponseGroupFromJSON,
    ResponseGroupToJSON,
} from '../models';

export interface AddMeToGroupRequest {
    groupID: string;
}

export interface CreateGroupRequest {
    requestGroup: RequestGroup;
}

export interface DeleteGroupRequest {
    groupID: string;
}

export interface DeleteMeFromGroupRequest {
    groupID: string;
}

export interface GetGroupRequest {
    groupID: string;
}

export interface GetMyGroupsRequest {
    relation?: string;
}

export interface GetUserGroupsRequest {
    userID: string;
    relation?: string;
}

export interface UpdateGroupRequest {
    groupID: string;
    requestGroup: RequestGroup;
}

/**
 * 
 */
export class GroupsApi extends runtime.BaseAPI {

    /**
     * 自分をメンバーに追加する
     * 自分を追加。open=true
     */
    async addMeToGroupRaw(requestParameters: AddMeToGroupRequest): Promise<runtime.ApiResponse<ResponseGroup>> {
        if (requestParameters.groupID === null || requestParameters.groupID === undefined) {
            throw new runtime.RequiredError('groupID','Required parameter requestParameters.groupID was null or undefined when calling addMeToGroup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/groups/{groupID}/members/me`.replace(`{${"groupID"}}`, encodeURIComponent(String(requestParameters.groupID))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseGroupFromJSON(jsonValue));
    }

    /**
     * 自分をメンバーに追加する
     * 自分を追加。open=true
     */
    async addMeToGroup(requestParameters: AddMeToGroupRequest): Promise<ResponseGroup> {
        const response = await this.addMeToGroupRaw(requestParameters);
        return await response.value();
    }

    /**
     * グループを作成します。traQのグループとは無関係です。
     * グループ作成
     */
    async createGroupRaw(requestParameters: CreateGroupRequest): Promise<runtime.ApiResponse<ResponseGroup>> {
        if (requestParameters.requestGroup === null || requestParameters.requestGroup === undefined) {
            throw new runtime.RequiredError('requestGroup','Required parameter requestParameters.requestGroup was null or undefined when calling createGroup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/groups`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RequestGroupToJSON(requestParameters.requestGroup),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseGroupFromJSON(jsonValue));
    }

    /**
     * グループを作成します。traQのグループとは無関係です。
     * グループ作成
     */
    async createGroup(requestParameters: CreateGroupRequest): Promise<ResponseGroup> {
        const response = await this.createGroupRaw(requestParameters);
        return await response.value();
    }

    /**
     * グループの削除
     * Delete group
     */
    async deleteGroupRaw(requestParameters: DeleteGroupRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.groupID === null || requestParameters.groupID === undefined) {
            throw new runtime.RequiredError('groupID','Required parameter requestParameters.groupID was null or undefined when calling deleteGroup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/groups/{groupID}`.replace(`{${"groupID"}}`, encodeURIComponent(String(requestParameters.groupID))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * グループの削除
     * Delete group
     */
    async deleteGroup(requestParameters: DeleteGroupRequest): Promise<void> {
        await this.deleteGroupRaw(requestParameters);
    }

    /**
     * 自分しか削除出来ない。open=true
     * 自分しか削除出来ない。open=true
     */
    async deleteMeFromGroupRaw(requestParameters: DeleteMeFromGroupRequest): Promise<runtime.ApiResponse<ResponseGroup>> {
        if (requestParameters.groupID === null || requestParameters.groupID === undefined) {
            throw new runtime.RequiredError('groupID','Required parameter requestParameters.groupID was null or undefined when calling deleteMeFromGroup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/groups/{groupID}/members/me`.replace(`{${"groupID"}}`, encodeURIComponent(String(requestParameters.groupID))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseGroupFromJSON(jsonValue));
    }

    /**
     * 自分しか削除出来ない。open=true
     * 自分しか削除出来ない。open=true
     */
    async deleteMeFromGroup(requestParameters: DeleteMeFromGroupRequest): Promise<ResponseGroup> {
        const response = await this.deleteMeFromGroupRaw(requestParameters);
        return await response.value();
    }

    /**
     * 一件取得
     * 一件取得
     */
    async getGroupRaw(requestParameters: GetGroupRequest): Promise<runtime.ApiResponse<ResponseGroup>> {
        if (requestParameters.groupID === null || requestParameters.groupID === undefined) {
            throw new runtime.RequiredError('groupID','Required parameter requestParameters.groupID was null or undefined when calling getGroup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/groups/{groupID}`.replace(`{${"groupID"}}`, encodeURIComponent(String(requestParameters.groupID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseGroupFromJSON(jsonValue));
    }

    /**
     * 一件取得
     * 一件取得
     */
    async getGroup(requestParameters: GetGroupRequest): Promise<ResponseGroup> {
        const response = await this.getGroupRaw(requestParameters);
        return await response.value();
    }

    /**
     * すべてのグループを取得する
     * グループを全て取得
     */
    async getGroupsRaw(): Promise<runtime.ApiResponse<Array<ResponseGroup>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/groups`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ResponseGroupFromJSON));
    }

    /**
     * すべてのグループを取得する
     * グループを全て取得
     */
    async getGroups(): Promise<Array<ResponseGroup>> {
        const response = await this.getGroupsRaw();
        return await response.value();
    }

    /**
     * 自分の所属しているグループのIDを返す
     */
    async getMyGroupsRaw(requestParameters: GetMyGroupsRequest): Promise<runtime.ApiResponse<Array<string>>> {
        const queryParameters: any = {};

        if (requestParameters.relation !== undefined) {
            queryParameters['relation'] = requestParameters.relation;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users/me/groups`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * 自分の所属しているグループのIDを返す
     */
    async getMyGroups(requestParameters: GetMyGroupsRequest): Promise<Array<string>> {
        const response = await this.getMyGroupsRaw(requestParameters);
        return await response.value();
    }

    /**
     * ユーザーが所属しているグループのIDを返す
     */
    async getUserGroupsRaw(requestParameters: GetUserGroupsRequest): Promise<runtime.ApiResponse<Array<string>>> {
        if (requestParameters.userID === null || requestParameters.userID === undefined) {
            throw new runtime.RequiredError('userID','Required parameter requestParameters.userID was null or undefined when calling getUserGroups.');
        }

        const queryParameters: any = {};

        if (requestParameters.relation !== undefined) {
            queryParameters['relation'] = requestParameters.relation;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users/{userID}/groups`.replace(`{${"userID"}}`, encodeURIComponent(String(requestParameters.userID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * ユーザーが所属しているグループのIDを返す
     */
    async getUserGroups(requestParameters: GetUserGroupsRequest): Promise<Array<string>> {
        const response = await this.getUserGroupsRaw(requestParameters);
        return await response.value();
    }

    /**
     * adminsのみ変更可能
     */
    async updateGroupRaw(requestParameters: UpdateGroupRequest): Promise<runtime.ApiResponse<ResponseGroup>> {
        if (requestParameters.groupID === null || requestParameters.groupID === undefined) {
            throw new runtime.RequiredError('groupID','Required parameter requestParameters.groupID was null or undefined when calling updateGroup.');
        }

        if (requestParameters.requestGroup === null || requestParameters.requestGroup === undefined) {
            throw new runtime.RequiredError('requestGroup','Required parameter requestParameters.requestGroup was null or undefined when calling updateGroup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/groups/{groupID}`.replace(`{${"groupID"}}`, encodeURIComponent(String(requestParameters.groupID))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: RequestGroupToJSON(requestParameters.requestGroup),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseGroupFromJSON(jsonValue));
    }

    /**
     * adminsのみ変更可能
     */
    async updateGroup(requestParameters: UpdateGroupRequest): Promise<ResponseGroup> {
        const response = await this.updateGroupRaw(requestParameters);
        return await response.value();
    }

}
