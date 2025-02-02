import UserProvider from "../contexts/UserProvider";
import { SidebarProvider } from "../contexts/SidebarContext";
import { Navigation } from "../components/Navigation";
import { MobileSidebar } from "../components/MobileSidebar";
import { DesktopSidebar } from "../components/DesktopSidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Layout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <UserProvider>
      <NuqsAdapter>
        <SidebarProvider>
          <main className="flex h-screen">
            <div className="flex peer" data-state="close" id="sidebar">
              <Navigation />
              <MobileSidebar>{sidebar}</MobileSidebar>
              <DesktopSidebar>{sidebar}</DesktopSidebar>
            </div>
            <div className="flex-1 p-3 ml-[72px] sm:peer-[[data-state=open]]:ml-[360px] peer-[[data-state=open]]:ml-0 ">
              <div className="rounded-xl shadow-inner p-4 w-full">
                {children}
              </div>
            </div>
          </main>
        </SidebarProvider>
      </NuqsAdapter>
    </UserProvider>
  );
}
