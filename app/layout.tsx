import HeaderAuth from "@/components/headerAuth"
import { GeistSans } from "geist/font/sans"
import Link from "next/link"
import "./globals.css"
import MenuToggle from "./components/MenuToggle"
import { SidebarProvider } from "./contexts/SidebarContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <SidebarProvider>
          <main className="flex flex-col h-screen bg-background text-foreground">
            <header className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center">
                <MenuToggle />
                <Link href="/" className="text-lg sm:text-xl ml-2">
                  ReView
                </Link>
              </div>
              <HeaderAuth />
            </header>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}
