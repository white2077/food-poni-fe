import {UserAPIResponse} from "../user/UserResponseAPI";

export interface NotificationAPIResponse {

    id: string,

    toUser: UserAPIResponse,

    fromUser: UserAPIResponse,

    type: string,

    message: string,

    read: boolean,

    createdDate: Date

}