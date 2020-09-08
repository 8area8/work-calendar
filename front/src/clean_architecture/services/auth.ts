import { httpClient } from "../common/base_api";
import { AxiosResponse } from "axios";

export interface ITokens {
  token: string;
  refresh: string;
}

export interface ITokensError {
  detail: string;
}

export interface IAuthService {
  authenticate: (name: string, password: string) => Promise<ITokens | false>;
  refresh: (token: string) => Promise<string | false>;
}

export class MockAuthService implements IAuthService {
  async authenticate(name: string, password: string): Promise<ITokens | false> {
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
      return false;
    }
  }

  async refresh(token: string): Promise<string | false> {
    if (["userrefresh", "adminrefresh"].includes(token)) {
      return "newtoken";
    } else {
      return false;
    }
  }
}

// export class AuthService implements IAuthService {
//   public async authenticate(
//     name: string,
//     password: string
//   ): Promise<ITokens | false> {
//     const response = await httpClient.post<ITokens | ITokensError>("/token/", {
//       name,
//       password
//     });
//     return response;
//   }
// }
