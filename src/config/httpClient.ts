import axios, { AxiosError } from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://localhost:3000'
});

//interceptor de solicitud -> se ejecuta antes de cada solicitud 
httpClient.interceptors.request.use(
  async (config) => {
    //se maneja la autenticación de usuario
    // const user = await userManager.getUser();
    // if (user) {
    //   config.headers.Authorization = `Bearer ${user.access_token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//interceptor de respuesta -> se ejecuta antes de que se resuelva la promesa de la solicitud
httpClient.interceptors.response.use(
  (response) => response,
  (err) => {
    //se manejan los errores de respuesta
    const customError = new Error();
    const error = err as AxiosError;

    //*error de respuesta: cuando el cliente recibe una respuesta de error (codigos HTTP 5xx o 4xx)
    if (error.response) {
      const method = error.response.config.method;

      //se asigna un mensaje de error personalizado dependiendo del método de la solicitud
      switch (method) {
        case 'get':
          customError.message = `No pudimos cargar los datos, inténtelo más tarde`;
          break;
        case 'post':
        case 'put':
        case 'patch':
        case 'delete':
          customError.message = `No pudimos procesar la solicitud, inténtelo más tarde`;
          break;
        default:
          customError.message = `Algo no salió como esperábamos, inténtelo más tarde`;
      }
    }

    //*error de solicitud: cuando el cliente nunca recibe una respuesta o el request falló
    else if (error.request) {
      customError.message = `Parece que hay un problema con la conexión, inténtelo más tarde`;
    }

    //*otros errores
    else {
      console.error(err);
      customError.message = 'Ocurrió un error inesperado, por favor inténtelo más tarde';
    }

    //se rechaza la promesa con el mensaje de error personalizado
    return Promise.reject(customError);
  }
);
