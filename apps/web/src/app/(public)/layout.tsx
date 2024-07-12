import { isAuthenticated } from "@/utils/auth";
import { redirect } from "next/navigation";
import Header from "./header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (isAuthenticated()) {
    redirect("/");
  }

  return (
    <main className="w-full min-h-screen flex flex-col p-4">
      <Header />
      {children}
    </main>
  );
}
