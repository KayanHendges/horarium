import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function ContextProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <Toaster />
      </ThemeProvider>
      {children}
    </>
  );
}
