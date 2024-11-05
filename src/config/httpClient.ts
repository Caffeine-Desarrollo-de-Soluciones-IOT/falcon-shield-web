import type { IProblemDetails } from '@/interfaces/common';
import { AuthService } from '@/service/AuthService';
import axios, { AxiosError } from 'axios';
import { ConnectionError, ResponseError, UnexpectedError } from './errors';

export const httpClient = axios.create({
  baseURL: 'https://falconshield.onrender.com/api'
});

//request interceptor -> it executes before the request promise is resolved
//interceptor de solicitud -> se ejecuta antes de cada solicitud
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
    const error = err as AxiosError<IProblemDetails>;
    let customError: Error;

    //response error: when the client receives an error response (HTTP 5xx or 4xx status codes)
    if (error.response) {
      if (error.response.status === 400) {
        customError = new ResponseError(
          error.response.data.errors?.join(', ') || error.response.data.detail,
          error.response.status
        );
      } else {
        customError = new ResponseError(error.response.data.detail, error.response.status);
      }
    }

    //request error: when the client never receives a response, or the request never left
    else if (error.request) {
      customError = new ConnectionError();
    }

    //other errors
    else {
      customError = new UnexpectedError(err);
    }

    //return the error
    return Promise.reject(customError);
  }
);
