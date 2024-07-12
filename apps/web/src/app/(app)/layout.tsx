import { redirect } from "next/navigation";

import { isAuthenticated } from "@/utils/auth";
import { Header } from "@/components/Header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isAuthenticated()) {
    redirect("/product");
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 w-full">
      {children}
      </div>
    </div>
  );
}
