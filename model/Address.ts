export interface Address {
    id: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    lon: number;
    lat: number;
}

export const INITIAL_CURRENT_ADDRESS: Address = {
    id: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    lon: 0,
    lat: 0
}