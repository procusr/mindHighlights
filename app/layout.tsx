import { GeistSans } from "geist/font/sans"
import { Montserrat } from "next/font/google"
import "./globals.css"

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
        <main className="flex flex-col h-screen bg-background text-foreground">
          {children}
        </main>
      </body>
    </html>
  )
}
