import {AddressAPIResponse} from "../address/AddressAPIResponse";

export interface UserAPIResponse {

    id: string;

    avatar: string;

    email: string;

    gender: boolean;

    birthday: string;

    username: string;

    role: string;

    status: boolean;

    address: AddressAPIResponse;

}