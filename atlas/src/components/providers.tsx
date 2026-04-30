"use client";

import React from "react";
import { SWRConfig } from "swr";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: false,
        shouldRetryOnError: false,
        fetcher: async (url: string) => {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("atlas_token")
              : null;

          const res = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });

          if (!res.ok) {
            const error = new Error("An error occurred while fetching data.");
            throw error;
          }

          return res.json();
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
