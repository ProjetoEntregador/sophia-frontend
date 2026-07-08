import { getAuthorizedConfig, pharmacyApi } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

export class AuthService {
  static async registerAccount(body: RegisterPayload) {
    const { data } = await pharmacyApi.post<ApiResponse<null>>(
      "/auth/registration",
      body,
    );
    return data;
  }

  static async loginAccount(body: LoginPayload) {
    const { data } = await pharmacyApi.post<ApiResponse<string>>(
      "/auth/login",
      body,
    );
    return data;
  }

  static async loginGoogle(body: GoogleLoginPayload) {
    const { data } = await pharmacyApi.post<ApiResponse<string>>(
      "/auth/google",
      body,
    );
    return data;
  }

  static async me(token: string) {
    const { data } = await pharmacyApi.get<ApiResponse<User>>(
      "/auth/info",
      getAuthorizedConfig(token),
    );
    return data;
  }
}
