import {AddressAPIResponse} from "../address/AddressAPIResponse";

export interface UserAPIResponse {

    id: string;

    avatar: string;

    email: string;

    birthday: string;

    gender: boolean;

    username: string;

    role: string;

    status: boolean;

    address: AddressAPIResponse;

}