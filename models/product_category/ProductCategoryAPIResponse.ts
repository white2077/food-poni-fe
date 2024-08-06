export interface ProductCategoryAPIResponse {

    id: string;

    name: string;

    slug: string;

    description: string;

    thumbnail: string;

    default: boolean;

    productCategories: ProductCategoryAPIResponse[];

    parentProductCategory: ProductCategoryAPIResponse | null;

}