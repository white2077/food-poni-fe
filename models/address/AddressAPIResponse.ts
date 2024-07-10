export interface AddressAPIResponse {

    id: string;

    fullName: string;

    phoneNumber: string;

    address: string;

    lon: number;

    lat: number;

}

export const INITIAL_ADDRESS_API_RESPONSE: AddressAPIResponse = {

    id: '',

    fullName: '',

    phoneNumber: '',

    address: '',

    lon: 0,

    lat: 0

}