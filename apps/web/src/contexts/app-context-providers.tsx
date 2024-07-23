"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { UserProvider } from "./user-context";
import { WorkspaceProvider } from "./workspace-context";

const queryClient = new QueryClient({});

export function AppContextProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
