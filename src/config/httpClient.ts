import type { IApiResponse, IErrorResponse } from '@/interfaces/common';
import { AuthService } from '@/service/AuthService';
import axios, { AxiosError } from 'axios';
import { FalconShieldError } from './FalconShieldError';

export const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api'
});

//request interceptor -> it executes before the request promise is resolved
httpClient.interceptors.request.use(
  async (config) => {
    //handle user authentication & token
    const user = await AuthService.getUser();
    if (user) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor -> it executes before the response promise is resolved
httpClient.interceptors.response.use(
  (response) => response,
  (err) => {
    const customError = new FalconShieldError('Error', 'No details');
    const error = err as AxiosError<IApiResponse<IErrorResponse>>;

    //response error: when the client receives an error response (HTTP 5xx or 4xx status codes)
    if (error.response) {
      //if error is 400
      customError.message = error.response.status === 400 ? 'Bad Request' : error.response.data.message;
      customError.details = error.response.data.data.details;
    }

    //request error: when the client never receives a response, or the request never left
    else if (error.request) {
      customError.message = 'Connection Error';
      customError.details = `It seems that we couldn't establish a connection, please try again later`;
    }

    //other errors
    else {
      console.error(err);
      customError.message = 'Unknown Error';
      customError.details = 'An unexpected error occurred, please try again later';
    }

    //return the error
    return Promise.reject(customError);
  }
);
