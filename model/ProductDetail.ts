import {Product} from "./Product";

export interface ProductDetail {

    id: string;

    name: string;

    price: number;

    description: string;

    status: boolean;

    images: string[];

    product: Product;

}

export interface ProductDetailRequest {

    id?: string;

    name?: string;

    price: number;

    description?: string;

    status: boolean;

    images?: string[];

}
