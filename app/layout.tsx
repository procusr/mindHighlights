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
      <body className=" leading-normal">
        <SidebarProvider>
          <main className="flex flex-col h-screen bg-background text-foreground">
            <header className="flex items-center justify-between p-2  border-b border-border bg-background  shadow-sm sticky top-0 z-50 ">
              <div className="flex items-center">
                <MenuToggle />
                <Link
                  href="/"
                  className={`text-2xl font-semibold ml-3 ${montserrat.className}`}
                >
                  Re<span className="text-bg text-primary">View</span>
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
