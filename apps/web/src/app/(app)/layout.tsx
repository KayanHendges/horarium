import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { AppContextProviders } from "@/contexts/app-context-providers";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppContextProviders>
      <div className="w-full min-h-screen flex bg-muted">
        <Sidebar />
        <div className="flex-1 h-full flex flex-col">
          <Header />
          <div className="w-full flex-1">{children}</div>
        </div>
      </div>
    </AppContextProviders>
  );
}
