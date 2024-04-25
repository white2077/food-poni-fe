import {AddressResponseDTO} from "../address/AddressResponseAPI";

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