export interface IApiResponse<T = null> {
  message: string;
  data: T;
  success: boolean;
}

export interface IErrorResponse {
  details: string;
  uri: string;
  timestamp: string;
}