import {INITIAL_USER_API_RESPONSE, UserResponseDTO} from "../user/UserResponseAPI";

export interface NotificationAPIResponse {

    id: string,

    toUser: UserResponseDTO,

    fromUser: UserResponseDTO,

    message: string,

    isRead: boolean,

    createdDate: Date

}

export const INITIAL_NOTIFICATION_API_RESPONSE: NotificationAPIResponse = {

    id: "",

    toUser: INITIAL_USER_API_RESPONSE,

    fromUser: INITIAL_USER_API_RESPONSE,

    message: "",

    isRead: false,

    createdDate: new Date()

}