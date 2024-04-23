export interface DeliveryInformation {
    id: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    lon: number;
    lat: number;
}

export interface DeliveryInformationRequest {
    fullName: string;
    phoneNumber: string;
    address: string;
    lon: number;
    lat: number;
}

export const INITIAL_DELIVERY_INFORMATION: DeliveryInformation = {
    id: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    lon: 0,
    lat: 0
}