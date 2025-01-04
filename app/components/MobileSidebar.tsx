// components/sidebar/mobile-sidebar.tsx
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { useSidebar } from "../contexts/NewSidebarContext";

const getMenuTitle = (pathname: string) => {
  if (pathname.startsWith("/folders")) return "Folders";
  if (pathname.startsWith("/search")) return "Search";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Home";
};

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className="
        fixed inset-y-0 left-16 right-0 z-50
        md:hidden
        bg-card border-l border-border
      "
      >
        <div className="h-full flex flex-col">
          <div className="px-4 h-14 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">{getMenuTitle(pathname)}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
