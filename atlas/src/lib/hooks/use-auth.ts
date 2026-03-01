"use client";

import { useState, useEffect, useCallback } from "react";
import { User, LoginRequest, TokenResponse } from "@/types/auth";
import { apiClient } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("atlas_token");
    const userStr = localStorage.getItem("atlas_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem("atlas_token");
        localStorage.removeItem("atlas_user");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post<TokenResponse>(
        "/auth/login",
        credentials
      );

      localStorage.setItem("atlas_token", response.access_token);
      localStorage.setItem("atlas_user", JSON.stringify(response.user));

      setState({
        user: response.user,
        token: response.access_token,
        isLoading: false,
        isAuthenticated: true,
      });

      return response;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("atlas_token");
    localStorage.removeItem("atlas_user");
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return {
    ...state,
    login,
    logout,
  };
}
