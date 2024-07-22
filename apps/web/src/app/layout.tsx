import { ContextProviders } from "@/contexts/context-providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Product",
  description: "System as a service example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <script src="https://apis.google.com/js/platform.js" async defer></script>
      <meta
        name="google-signin-client_id"
        content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      ></meta>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ContextProviders>{children}</ContextProviders>
      </body>
    </html>
  );
}
