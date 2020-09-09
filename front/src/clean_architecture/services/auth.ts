import { httpClient, IError } from "../common/base_api";
import { AxiosResponse } from "axios";

export interface ITokens {
  token: string;
  refresh: string;
}

export { IError } from "../common/base_api";

export interface IAuthService {
  authenticate: (
    username: string,
    password: string
  ) => Promise<ITokens | false>;
  refresh: (token: string) => Promise<string | IError>;
  checkAuthentication: () => Promise<boolean>;
}

export class MockAuthService implements IAuthService {
  async authenticate(
    username: string,
    password: string
  ): Promise<ITokens | false> {
    if (username === "user" && password === "user") {
      return {
        token: "usertoken",
        refresh: "userrefresh"
      };
    } else if (username === "admin" && password === "admin") {
      return {
        token: "admintoken",
        refresh: "adminrefresh"
      };
    }
    return false;
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

  async checkAuthentication(): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (token == "usertoken" || token == "admintoken") {
      return true;
    }
    return false;
  }
}

export class AuthService implements IAuthService {
  public async authenticate(
    username: string,
    password: string
  ): Promise<ITokens | false> {
    const result = await httpClient.post<ITokens>("/token/", {
      username,
      password
    });
    if ("type" in result) {
      return false;
    }
    localStorage.setItem("token", result.token);
    localStorage.setItem("refresh", result.refresh);
    return result;
  }

  public async refresh(token: string): Promise<string | IError> {
    return await httpClient.post<string>("/token/refresh/", {
      token
    });
  }

  async checkAuthentication(): Promise<boolean> {
    if (!(await this._checkToken()) && !(await this._refreshToken())) {
      return false;
    }
    return true;
  }

  async _checkToken(): Promise<boolean> {
    const token = localStorage.getItem("token") || "";
    const result = await httpClient.post<any>("/token/verify/", {
      token
    });
    return !("type" in result);
  }

  async _refreshToken(): Promise<boolean> {
    const refresh = localStorage.getItem("refresh") || "";
    const reloaded = await httpClient.post<any>("/token/refresh/", {
      refresh
    });
    if ("type" in reloaded) {
      return false;
    }
    localStorage.setItem("token", reloaded.access);
    return true;
  }
}
