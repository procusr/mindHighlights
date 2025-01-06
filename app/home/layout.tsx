export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
      <main className="flex flex-1 w-full overflow-hidden">{children}</main>
    </div>
  );
}
