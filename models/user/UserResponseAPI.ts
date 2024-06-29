import {AddressResponseDTO, INITIAL_ADDRESS_API_RESPONSE} from "../address/AddressResponseAPI";

export interface UserResponseDTO {

    id: string;

    avatar: string;

    email: string;

    firstName: string;

    lastName: string;

    phoneNumber: string;

    username: string;

    role: string;

    status: boolean;

    address: AddressResponseDTO;

}

export const INITIAL_USER_API_RESPONSE: UserResponseDTO = {

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