import { httpClient, IError } from "../common/base_api";
import { AxiosResponse } from "axios";

export interface ITokens {
  token: string;
  refresh: string;
}

export { IError } from "../common/base_api";

export interface IAuthService {
  authenticate: (name: string, password: string) => Promise<ITokens | IError>;
  refresh: (token: string) => Promise<string | IError>;
}

export class MockAuthService implements IAuthService {
  async authenticate(
    name: string,
    password: string
  ): Promise<ITokens | IError> {
    if (name === "user" && password === "user") {
      return {
        token: "usertoken",
        refresh: "userrefresh"
      };
    } else if (name === "admin" && password === "admin") {
      return {
        token: "admintoken",
        refresh: "adminrefresh"
      };
    } else {
      return {
        type: 401,
        message: "unhautorized"
      } as IError;
    }
  }

  async refresh(token: string): Promise<string | IError> {
    if (["userrefresh", "adminrefresh"].includes(token)) {
      return "newtoken";
    } else {
      return {
        type: 401,
        message: "unhautorized"
      } as IError;
    }
  }
}

export class AuthService implements IAuthService {
  public async authenticate(
    name: string,
    password: string
  ): Promise<ITokens | IError> {
    return await httpClient
      .post<ITokens>("/token/", {
        name,
        password
      })
      .then(data => data as ITokens)
      .catch(error => error as IError);
  }

  public async refresh(token: string): Promise<string | IError> {
    return await httpClient
      .post<string>("/token/refresh/", {
        token
      })
      .then(data => data as string)
      .catch(error => error as IError);
  }
}
