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

export const INITIAL_PRODUCT_CATEGORY_API_RESPONSE: ProductCategoryAPIResponse = {
    id: '',
    name: '',
    slug: '',
    description: '',
    thumbnail: '',
    default: false,
    productCategories: [],
    parentProductCategory: null,
}

