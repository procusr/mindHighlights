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
          <main className="h-[calc(100dvh-60px)] flex overflow-hidden mt-0 ">
            <div className="flex peer" data-state="close" id="sidebar">
              <Navigation />
              <MobileSidebar>{sidebar}</MobileSidebar>
              <DesktopSidebar>{sidebar}</DesktopSidebar>
            </div>
            <div className="flex-1 p-2 ml-[57px] sm:peer-[[data-state=open]]:ml-[352px] peer-[[data-state=open]]:ml-0">
              <div className="w-full h-full rounded-xl shadow-inner flex flex-col  bg-background">
                <div className="p-4 border-b flex-shrink-0">
                  <h2 className="text-xl font-bold">Scrollable Content</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">{children}</div>
                </div>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </NuqsAdapter>
    </UserProvider>
  );
}
