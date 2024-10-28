import { SidebarProvider } from "../contexts/SidebarContext";
import MenuToggle from "../components/MenuToggle";
import Link from "next/link";
import HeaderAuth from "@/components/headerAuth";
import Logo from "@/components/Logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
        <header className="flex items-center justify-between py-2 pl-2 border-b border-border bg-background shadow-sm sticky top-0 z-50 w-full">
          <div className="flex items-center flex-grow">
            <MenuToggle />
            <Link href="/" title="Home" className="sm:ml-3 flex-shrink-0">
              <Logo />
            </Link>
          </div>
          <HeaderAuth />
        </header>
        <main className="flex flex-1 w-full overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
