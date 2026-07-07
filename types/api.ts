export type AuthorizedRequestConfig = {
  headers: {
    Authorization: string;
  };
};

export type ApiResponse<T> = {
  status: string;
  data: T | null;
  message: string;
};

export type ApiList<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
};
