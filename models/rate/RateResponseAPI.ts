export interface RateResponseDTO {

    rate: number;

    message: string;

    images: string[];

    name: string;

    thumbnail: string;

    username: string;

    avatar: string;

}

export const INITIAL_RATE_API_RESPONSE: RateResponseDTO = {

    rate: 0,

    message: '',

    images: [],

    name: '',

    thumbnail: '',

    username: '',

    avatar: '',

}