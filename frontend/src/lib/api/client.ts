const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8004/api/v1";

class ApiClient {
  private getToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem("legalai_token")
      : null;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || "Request failed");
    }

    return res.json();
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  async upload<T>(path: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || "Upload failed");
    }

    return res.json();
  }
}

export const apiClient = new ApiClient();
