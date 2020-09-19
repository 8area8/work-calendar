import { httpClient, IError } from "../common/base_api";

export { IError } from "../common/base_api";

export interface ITokens {
  token: string;
  refresh: string;
}

export interface IRouter {
  redirectToAuth: () => void;
}

export interface IAuthService {
  router: IRouter;
  authenticate: (
    username: string,
    password: string
  ) => Promise<ITokens | false>;
  refresh: (token: string) => Promise<string | IError>;
  checkAuthentication: () => Promise<boolean>;
}

export class Router implements IRouter {
  _router = require("@/router");
  redirectToAuth() {
    this._router.push({ name: "Auth" });
  }
}

export class AuthService implements IAuthService {
  public router = new Router();

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

export function verifyAuth(
  target: Record<string, any>,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const auth = new AuthService();
  const originalMethod = descriptor.value;

  descriptor.value = async function(...args: any[]) {
    let result = await originalMethod.apply(this, args);

    if ("type" in result) {
      const isAuth = await auth.checkAuthentication();

      if (!isAuth) {
        console.log("Redirection to authentication.");
        auth.router.redirectToAuth();
      } else if (result.type >= 500) {
        return result;
      } else {
        result = await originalMethod.apply(this, args);
      }
    }

    return result;
  };

  return descriptor;
}
