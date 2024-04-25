import {CurrentUser} from "../../pages/login";

export interface UserIdDTO {

    id: string;

}

export interface UserCreationRequestDTO {

    username: string;

    email: string;

    password: string;

}

export interface UserUpdateInfoRequestDTO {

    username: string;

    biography: string;

}

export interface UserUpdateAvatarRequestDTO {

    avatar: string;

}

export interface ChangePasswordRequestDTO {

    oldPassword: string;

    newPassword: string;

}