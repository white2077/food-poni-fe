
export interface Category {
  id: string;

  categoryName: string;

  slug: string;

  description: string;

  thumbnail: string;

  default: boolean;

  categories: Category[];

  parentCategory: Category;

}

export interface CategoryRequest {
  id: string;
}
