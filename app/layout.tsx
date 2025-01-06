import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Metadata } from "next";
import { Navigation } from "./home/Components/Navigation";
import { SidebarProvider } from "./contexts/SidebarContext";
import { MobileSidebar } from "./components/MobileSidebar";
import { DesktopSidebar } from "./components/DesktopSidebar";
import HeaderAuth from "@/components/headerAuth";
import Logo from "@/components/Logo";
import Link from "next/link";

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
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
      </head>

      <body className="bg-background text-foreground">
        <header className="flex items-center justify-between py-2 pl-2  bg-background sticky top-0 z-50 w-full">
          <div className="flex items-center flex-grow">
            <Link href="/" title="Home" className="sm:ml-3 flex-shrink-0">
              <Logo />
            </Link>
          </div>
          <HeaderAuth />
        </header>
        <NuqsAdapter>
          <SidebarProvider>
            <main className="flex h-screen gap-2">
              <Navigation />
              <MobileSidebar>{sidebar}</MobileSidebar>
              <DesktopSidebar>{sidebar}</DesktopSidebar>
              <div className="flex-1 rounded-xl shadow-inner border-b-gray-600/20 p-4">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
