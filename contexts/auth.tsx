"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { AuthService } from "@/services/authService";
import { LoginPayload, RegisterPayload, User } from "@/types/auth";
import { InviteService } from "@/services/inviteService";
import {
  getToken,
  getUserToken,
  removeToken,
  login as userLogin,
  logout as userLogout,
} from "@/app/actions/auth";

type AuthContextType = {
  user: User;
  loading: boolean;
  register: (body: RegisterPayload) => Promise<void>;
  login: (body: LoginPayload) => Promise<void>;
  loginGoogle: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = await getUserToken();

    if (token) {
      const response = await AuthService.me(token);
      setUser(response.data);
    }
    setLoading(false);
  };

  const register = async (body: RegisterPayload) => {
    await AuthService.registerAccount(body);
  };

  const login = async (body: LoginPayload) => {
    const response = await AuthService.loginAccount(body);

    const token = response.data;

    if (!token) {
      throw new Error("The backend did not return a valid session token.");
    }

    await userLogin(token);

    const accessToken = await getToken();
    if (accessToken) {
      await InviteService.acceptInvite(
        {
          token: accessToken,
        },
        token,
      );
      await removeToken();
    }

    refreshUser();
  };

  const loginGoogle = async (token: string) => {
    await userLogin(token);

    const accessToken = await getToken();
    if (accessToken) {
      await InviteService.acceptInvite(
        {
          token: accessToken,
        },
        token,
      );
      await removeToken();
    }

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
        loginGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
