export interface CategoryResponseDTO {

    id?: string;

    categoryName?: string;

    slug?: string;

    description?: string;

    thumbnail?: string;

    default?: boolean;

    categories?: CategoryResponseDTO[];

    parentCategory?: CategoryResponseDTO;

}