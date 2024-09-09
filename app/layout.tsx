
import HeaderAuth from "@/components/headerAuth"

import { GeistSans } from "geist/font/sans"

import Link from "next/link"
import "./globals.css"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3001"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "The missing apps for readers",
  description:
    "Easly remember the books you have read and take memorable notes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        
          <main className="flex-grow flex flex-col items-center">
            <div className="w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Readers Heaven</Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>
            </div>
          </main>
      </body>
    </html>
  )
}
