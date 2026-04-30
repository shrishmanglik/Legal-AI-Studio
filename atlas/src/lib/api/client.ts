import { ApiError } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8004/api/v1";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("atlas_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = "GET", headers = {}, body, token } = options;

    const authToken = token || this.getToken();

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.detail || errorData.message || "An error occurred",
        status: response.status,
        errors: errorData.errors,
      };
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { token });
  }

  async post<T>(endpoint: string, body?: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, token });
  }

  async put<T>(endpoint: string, body?: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, token });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    token?: string
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, token });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", token });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
