export interface IApiResponse<T = null> {
  message: string;
  data: T;
  success: boolean;
}