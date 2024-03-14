export interface ProductDetail {

   id: string;

   name: string;

   price: number;

   description: string;

   status: boolean;

   images: string[];

}

export interface ProductDetailRequest {

  id?: string;

  name?: string;

  price: number;

  description?: string;

  status: boolean;

  images?: string[];

}
