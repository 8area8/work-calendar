import { IError } from "../common/base_api";
import { IRouter, IAuthService, ITokens } from "./auth";

export class MockRouter implements IRouter {
  redirectToAuth() {
    return;
  }
}

export class MockAuthService implements IAuthService {
  public router = new MockRouter();

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
