import { api } from "@/lib/api";
import { RegisterFormValues } from "@/app/(auth)/register/register.schema";
import { LoginFormValues } from "@/app/(auth)/login/login.schema";

export class AuthService {
  static async registerAccount(values: RegisterFormValues) {
    const response = await api.post("/auth/register", {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });

    return response.data as unknown;
  }

  static async loginAccount(values: LoginFormValues) {
    const response = await api.post("/auth/login", {
      email: values.email,
      password: values.password,
    });

    return response.data as unknown;
  }
}
