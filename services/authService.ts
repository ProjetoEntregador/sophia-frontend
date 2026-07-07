import { getAuthorizedConfig, pharmacyApi } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  User
} from "@/types/auth";

export class AuthService {
  static async registerAccount(body: RegisterPayload) {
    const response = await pharmacyApi.post<ApiResponse<null>>(
      "/auth/registration",
      body,
    );
    return response.data;
  }

  static async loginAccount(body: LoginPayload) {
    const response = await pharmacyApi.post<ApiResponse<string>>(
      "/auth/login",
      body,
    );
    return response.data;
  }

  static async loginGoogle(body: GoogleLoginPayload) {
    const response = await pharmacyApi.post<ApiResponse<string>>(
      "/auth/google",
      body,
    );
    return response.data;
  }

  static async me(token: string) {
    const response = await pharmacyApi.get<ApiResponse<User>>(
      "/auth/info",
      getAuthorizedConfig(token),
    );
    return response.data;
  }
}
