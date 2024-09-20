import HeaderAuth from "@/components/headerAuth"
import { GeistSans } from "geist/font/sans"
import Link from "next/link"
import "./globals.css"
import MenuToggle from "./components/MenuToggle"
import { SidebarProvider } from "./contexts/SidebarContext"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} ${montserrat.className}`}
    >
      <body className="dark:bg-gray-900 dark:text-white">
        <SidebarProvider>
          <main className="flex flex-col h-screen bg-background text-foreground">
            <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center">
                <MenuToggle />
                <Link
                  href="/"
                  className={`text-2xl font-semibold ml-3 ${montserrat.className}`}
                >
                  Re<span className="text-bg text-accent">View</span>
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
