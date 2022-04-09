export interface CreateCategoryParams {
  name: string;
  description?: string;
}

export interface GetCategoriesParams {
  page: number;
  pageSize: number;
}

export type UpdateCategoryParams = Partial<CreateCategoryParams>;
