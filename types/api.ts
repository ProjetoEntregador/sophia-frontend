export type AuthorizedRequestConfig = {
  headers: {
    Authorization: string;
  };
};

export type ApiResponse<T> = {
  status: string;
  data: T;
  message: string;
};

export type ApiList<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
};

export type ItemsPaginatedApiResponse<T> = {
  items: T[];
  total: number;
};

export type DataPaginatedApiResponse<T> = {
  data: T[];
  total: number;
};
