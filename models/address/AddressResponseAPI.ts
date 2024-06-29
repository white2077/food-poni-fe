export interface AddressResponseDTO {

    id?: string;

    fullName?: string;

    phoneNumber?: string;

    address?: string;

    lon?: number;

    lat?: number;

}

export const INITIAL_ADDRESS_API_RESPONSE: AddressResponseDTO = {

    id: '',

    fullName: '',

    phoneNumber: '',

    address: '',

    lon: 0,

    lat: 0

}