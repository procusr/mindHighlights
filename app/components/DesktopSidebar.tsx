"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useSidebar } from "../contexts/SidebarContext";
import { isNotLoggedInPage } from "@/utils/url/isNotLoggedInPage";

export function DesktopSidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith("/folders")) return "Folders";
    if (pathname.startsWith("/search")) return "Search";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Home";
  };

  if (!isOpen) return null;

  if (isNotLoggedInPage()) return null;

  return (
    <aside className="hidden md:block w-64 rounded-xl bg-muted/30 shadow-lg">
      <div className="h-full flex flex-col">
        <div className="p-4 h-14 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">{getTitle()}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 p-2">{children}</div>
      </div>
    </aside>
  );
}
