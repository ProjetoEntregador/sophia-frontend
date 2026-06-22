"use client";

import { AuthService } from "@/services/authService";
import { LoginPayload, RegisterPayload, User } from "@/types/auth";
import { login as userLogin, logout as userLogout } from "@/app/actions/auth";
import { createContext, useEffect, useState, ReactNode } from "react";

type AuthContextType = {
  user: User;
  loading: boolean;
  register: (body: RegisterPayload) => Promise<void>;
  login: (body: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    // consumir dados do usuário
    setUser({ id: "1", name: "Lucas Nunes", email: "lucas@email.com" });
  };

  const register = async (body: RegisterPayload) => {
    await AuthService.registerAccount(body);
  };

  const login = async (body: LoginPayload) => {
    const response = await AuthService.loginAccount(body);

    if (!response.data) {
      throw new Error("The backend did not return a valid session token.");
    }

    await userLogin(response.data);
    refreshUser();
  };

  const logout = async () => {
    await userLogout();
    setUser({} as User);
  };

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
