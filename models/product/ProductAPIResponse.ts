import {UserAPIResponse} from "../user/UserAPIResponse";

export interface ProductAPIResponse {

    id: string;

    name: string;

    slug: string;

    shortDescription: string;

    thumbnail: string;

    status: boolean;

    user: UserAPIResponse;

    sales: number;

    rate: number;

    rateCount: number;

    minPrice: number;

    maxPrice: number;

    createdDate: Date;

    updatedDate: Date;

}