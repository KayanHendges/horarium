import Header from "./header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-h-screen flex flex-col p-4">
      <Header />
      {children}
    </main>
  );
}
