export interface CategoryAPIResponse {

    id: string;

    categoryName: string;

    slug: string;

    description: string;

    thumbnail: string;

    default: boolean;

    categories: CategoryAPIResponse[];

    parentCategory: CategoryAPIResponse | null;

}

export const INITIAL_CATEGORY_API_RESPONSE: CategoryAPIResponse = {
    id: '',
    categoryName: '',
    slug: '',
    description: '',
    thumbnail: '',
    default: false,
    categories: [],
    parentCategory: null,
}

