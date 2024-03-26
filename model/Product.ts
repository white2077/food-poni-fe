import {User} from "./User";
import {ProductDetail} from "./ProductDetail";
import {Category} from "./Category";

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

