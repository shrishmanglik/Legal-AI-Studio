"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import type { User, LoginRequest, RegisterRequest, TokenResponse } from "@/types/auth";

const TOKEN_KEY = "legalai_token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAuthenticated = !!user;

  const fetchUser = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await apiClient.get<User>("/auth/me");
      setUser(userData);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setError(null);
      setLoading(true);
      try {
        const response = await apiClient.post<TokenResponse>(
          "/auth/login",
          credentials
        );
        localStorage.setItem(TOKEN_KEY, response.access_token);
        await fetchUser();
        router.push("/");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUser, router]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setError(null);
      setLoading(true);
      try {
        const response = await apiClient.post<TokenResponse>(
          "/auth/register",
          data
        );
        localStorage.setItem(TOKEN_KEY, response.access_token);
        await fetchUser();
        router.push("/");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUser, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
