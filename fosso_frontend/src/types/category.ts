export interface Category {
  categoryId?: string;
  name: string;
  imageId?: string;
  enabled?: boolean;
  parentId?: string;
  parentName?: string;
  children?: Category[];
  hasChildren?: boolean;
  subCategoriesId?: string[];
}
