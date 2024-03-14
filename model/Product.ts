import {User, UserRequest} from "./User";
import {ProductDetail, ProductDetailRequest} from "./ProductDetail";
import {Category, CategoryRequest} from "./Category";

export interface Product {

  id: string;

  name: string;

  slug: string;

  shortDescription: string | null;

  thumbnail: string | null;

  status: boolean;

  user: User;

  productDetails: ProductDetail[];

  categories: Category[];
}

export interface ProductRequest {

  id?: string;

  name: string;

  slug: string;

  shortDescription?: string;

  thumbnail?: string;

  status: boolean;

  user: UserRequest;

  productDetails: ProductDetailRequest[];

  categories?: CategoryRequest[];
}

