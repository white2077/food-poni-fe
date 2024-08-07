import {UserAPIResponse} from "../user/UserAPIResponse";

export interface NotificationAPIResponse {

    id: string,

    toUser: UserAPIResponse,

    fromUser: UserAPIResponse,

    type: string,

    message: string,

    read: boolean,

    createdDate: Date

}