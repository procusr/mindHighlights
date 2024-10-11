import { SidebarProvider } from "../contexts/SidebarContext"
import MenuToggle from "../components/MenuToggle"
import Link from "next/link"
import HeaderAuth from "@/components/headerAuth"
import Logo from "@/components/Logo"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="flex flex-col h-screen bg-background text-foreground">
        <header className="flex items-center justify-between p-2  border-b border-border bg-background  shadow-sm sticky top-0 z-50 ">
          <div className="flex items-center">
            <MenuToggle />
            <Link
              href="/"
              title="Home"
              className="text-2xl font-semibold ml-3 "
            >
              <Logo />
            </Link>
          </div>
          <HeaderAuth />
        </header>
        {children}
      </main>
    </SidebarProvider>
  )
}
