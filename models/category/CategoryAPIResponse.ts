export interface CategoryAPIResponse {

    id: string;

    categoryName: string;

    slug: string;

    image: string;

    description: string;

    thumbnail: string;

    default: boolean;

    categories: CategoryAPIResponse[];

    parentCategory: CategoryAPIResponse;

}

export const INITIAL_CATEGORY_API_RESPONSE = {
    id: '',
    categoryName: '',
    slug: '',
    image: '',
    description: '',
    thumbnail: '',
    default: false,
    categories: [],
    parentCategory: null,
}

