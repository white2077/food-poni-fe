import {ProductAPIResponse} from "../product/ProductAPIResponse";

export interface ProductDetailAPIResponse {

    id: string;

    name: string;

    price: number;

    description: string;

    status: boolean;

    images: string[];

    rate: number;

    sales: number;

    rateCount: number;

    product: ProductAPIResponse;

}