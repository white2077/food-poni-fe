import {ProductAPIResponse} from "../product/ProductAPIResponse";

export interface ProductDetailAPIResponse {

    id: string;

    name: string;

    price: number;

    description: string;

    sales: number;

    rate: number;

    rateCount: number;

    status: boolean;

    images: string[];

    product: ProductAPIResponse;

}