// components/sidebar/mobile-sidebar.tsx
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { useSidebar } from "../contexts/SidebarContext";
import { isNotLoggedInPage } from "@/utils/url/isNotLoggedInPage";

const getMenuTitle = (pathname: string) => {
  if (pathname.startsWith("/folders")) return "Folders";
  if (pathname.startsWith("/search")) return "Search";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Home";
};

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();
  if (isNotLoggedInPage()) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden right-0 bg-background size-full">
      <div
        onClick={() => setIsOpen(false)}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(false);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Close sidebar"
      />

      {/* Mobile Sidebar */}

      <div className="flex size-full flex-col">
        <div className="px-4 h-14 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">{getMenuTitle(pathname)}</h2>
          <Button
            variant="text"
            size="icon"
            onClick={() => {
              setIsOpen(false);
              document
                .getElementById("sidebar")
                ?.setAttribute("data-state", "close");
            }}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
}
