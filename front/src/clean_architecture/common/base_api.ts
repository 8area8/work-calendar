import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface IHttpClient {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T | IError>;
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<T | IError>;
  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<T | IError>;
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T | IError>;
}

export interface IError {
  message: string;
  type: ErrorType;
}

export enum ErrorType {
  Unauthenticated = 401,
  Unauthorized = 403,
  NotFound = 404,
  Server = 500,
}

export function isError(object: any): object is IError {
  return "type" in object;
}

class HttpClient implements IHttpClient {
  private _http: AxiosInstance;

  constructor() {
    this._http = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private setToken() {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T | IError> {
    return await this._http
      .get(url, { ...config, ...this.setToken() })
      .then((response) => {
        return response.data as T;
      })
      .catch((error) => {
        return {
          message: error.response.data.detail,
          type: error.response.status,
        } as IError;
      });
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T | IError> {
    return await this._http
      .post(url, data, { ...config, ...this.setToken() })
      .then((response) => {
        return response.data as T;
      })
      .catch((error) => {
        return {
          message: error.response.data.detail,
          type: error.response.status,
        } as IError;
      });
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T | IError> {
    return await this._http
      .patch(url, data, { ...config, ...this.setToken() })
      .then((response) => {
        return response.data as T;
      })
      .catch((error) => {
        return {
          message: error.response.data.detail,
          type: error.response.status,
        } as IError;
      });
  }

  public async delete<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T | IError> {
    return await this._http
      .delete(url, { ...config, ...this.setToken() })
      .then((response) => {
        return response.data as T;
      })
      .catch((error) => {
        return {
          message: error.response.data.detail,
          type: error.response.status,
        } as IError;
      });
  }
}

export const httpClient: IHttpClient = new HttpClient();
