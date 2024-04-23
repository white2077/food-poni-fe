export interface User {
    id: string;

    avatar: string;

    email: string;

    firstName: string;

    lastName: string;

    phoneNumber: string;

    username: string;

    role: string;

    status: boolean;

    address: string;

}

export interface CurrentUser {

    id: string;

    sub: string;

    roles: string[];

    firstName: string;

    lastName: string;

    avatar: string;

    email: string;

    phoneNumber: string;

    username: string;

    accessToken: string;

    addressId: string;

}

export interface UserRequest {

    id: string;

}

export interface UserRequestLogin {

    username: string | null;

    email: string | null;

    password: string;

}

export interface IUserRemember {

    username: string;

    password: string;

    avatar: string;

}
