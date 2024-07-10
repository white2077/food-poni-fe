import {AddressAPIResponse, INITIAL_ADDRESS_API_RESPONSE} from "../address/AddressAPIResponse";

export interface UserAPIResponse {

    id: string;

    avatar: string;

    email: string;

    firstName: string;

    lastName: string;

    phoneNumber: string;

    username: string;

    role: string;

    status: boolean;

    address: AddressAPIResponse;

}

export const INITIAL_USER_API_RESPONSE: UserAPIResponse = {

    id: '',

    avatar: '',

    email: '',

    firstName: '',

    lastName: '',

    phoneNumber: '',

    username: '',

    role: '',

    status: false,

    address: INITIAL_ADDRESS_API_RESPONSE

}