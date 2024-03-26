import {User, UserRequest} from "./User";
import {ProductDetail, ProductDetailRequest} from "./ProductDetail";
import {Category, CategoryRequest} from "./Category";

export interface Product {

  id: string;

  name: string;

  slug: string;

  shortDescription: string;

  thumbnail: string;

  status: boolean;

  user: User;

  productDetails: ProductDetail[];

  categories: Category[];

}

