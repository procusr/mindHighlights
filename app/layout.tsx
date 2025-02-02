import Logo from "@/components/Logo";
import HeaderAuth from "@/components/headerAuth";
import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
      </head>

      <body className="bg-background text-foreground ">
        <header className="flex items-center justify-between py-2 px-6 bg-background sticky top-0 z-50 w-full">
          <div className="flex items-center flex-grow">
            {/* <Link href="/" title="Home" className="sm:ml-3 flex-shrink-0">
              <Logo />
            </Link> */}
          </div>
          <HeaderAuth />
        </header>
        {children}
      </body>
    </html>
  );
}
