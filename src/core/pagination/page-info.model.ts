export interface PageInfoModel {
  offset: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PageInputModel {
  offset?: number;
  page?: number;
  limit?: number;
}
