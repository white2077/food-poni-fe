export interface AddressCreationRequestDTO {

    fullName: string;

    phoneNumber: string;

    address: string;

    lon: number;

    lat: number;

}

export interface AddressUpdateRequestDTO {

    id: string;

    fullName: string;

    phoneNumber: string;

    address: string;

    lon: number;

    lat: number;

}

export interface AddressIdDTO {

    id: string;

}

export interface AddressUpdatePhoneNumberRequestDTO {

    id: string;

    phoneNumber: string;

}

export interface AddressUpdateAddressRequestDTO {

    id: string;

    address: string;

    lon: number;

    lat: number;

}

export interface AddressUpdateNameRequestDTO {

    id: string;

    fullName: string;

}