import { authService } from '@/service/AuthService';
import axios, { AxiosError } from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api'
});

//request interceptor -> it executes before the request promise is resolved
httpClient.interceptors.request.use(
  async (config) => {
    //handle user authentication & token
    const user = await authService.getUser();
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
    const customError = new Error();
    const error = err as AxiosError;

    //response error: when the client receives an error response (HTTP 5xx or 4xx status codes)
    if (error.response) {
      const method = error.response.config.method;

      switch (method) {
        case 'get':
          customError.message = "We couldn't retrieve the data, please try again later";
          break;
        case 'post':
        case 'put':
        case 'patch':
        case 'delete':
          customError.message = "We couldn't process your request, please try again later";
          break;
        default:
          customError.message = 'We encountered an error, please try again later';
      }
    }

    //request error: when the client never receives a response, or the request never left
    else if (error.request) {
      customError.message = `It seems that we couldn't establish a connection, please try again later`;
    }

    //other errors
    else {
      console.error(err);
      customError.message = 'An unexpected error occurred, please try again later';
    }

    //return the error
    return Promise.reject(customError);
  }
);
