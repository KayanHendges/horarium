import { redirect } from "next/navigation";

import { isAuthenticated } from "@/utils/auth";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isAuthenticated()) {
    redirect("/product");
  }

  return children;
}
