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