export interface IApiResponse<T = null> {
  message: string;
  data: T;
  success: boolean;
}

export interface IProblemDetails {
  type: string;
  status: number;
  title: string;
  detail: string;
  instance: string;
  errors?: string[];
}