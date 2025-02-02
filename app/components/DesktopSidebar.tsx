"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useSidebar } from "../contexts/SidebarContext";
import AddNewFolder from "../(highlights)/@sidebar/folders/AddNewFolder";
import { cn } from "@/lib/utils";

export function DesktopSidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();

  const getTitle = () => {
    const map: Record<string, string> = {
      "/folders": "Folders",
      "/search": "Search Results",
      "/settings": "Preferences",
      "/": "home",
    };
    return (
      Object.entries(map).find(([path]) => pathname.startsWith(path))?.[1] ||
      "Navigation"
    );
  };

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "hidden sm:block w-64 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)]",
        "bg-background/95 backdrop-blur-sm border border-gray-100",
        "fixed top-[68px] left-[75px]",
        "h-[calc(100vh-56px)] z-50 rounded-xl",
        "data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header - Keeping original layout structure */}
        <div className="p-4 h-14 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-medium tracking-tight">
              {getTitle()}
            </h2>

            {pathname.startsWith("/folders") && (
              <AddNewFolder>
                <Button
                  variant="text"
                  size="icon"
                  className="hover:bg-gray-100 rounded-lg"
                  aria-label="New folder"
                >
                  <Plus className="size-5 text-primary" />
                </Button>
              </AddNewFolder>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setIsOpen(false);
              document
                .getElementById("sidebar")
                ?.setAttribute("data-state", "close");
            }}
            className="hover:bg-gray-100 rounded-lg"
            aria-label="Close sidebar"
          >
            <X className="size-5 text-gray-500" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </aside>
  );
}
