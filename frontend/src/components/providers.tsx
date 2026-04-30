"use client";

import { SWRConfig } from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8004/api/v1";

async function fetcher<T>(url: string): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("legalai_token")
      : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${url}`, { headers });

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return res.json();
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        dedupingInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
