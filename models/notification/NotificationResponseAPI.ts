import {INITIAL_USER_API_RESPONSE, UserAPIResponse} from "../user/UserResponseAPI";

export interface NotificationAPIResponse {

    id: string,

    toUser: UserAPIResponse,

    fromUser: UserAPIResponse,

    type: string,

    message: string,

    read: boolean,

    createdDate: Date

}

export const INITIAL_NOTIFICATION_API_RESPONSE: NotificationAPIResponse = {

    id: "",

    toUser: INITIAL_USER_API_RESPONSE,

    fromUser: INITIAL_USER_API_RESPONSE,

    type: "",

    message: "",

    read: false,

    createdDate: new Date()

}