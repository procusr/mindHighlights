"use client";

import { Home, Folder, Search, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/app/contexts/NewSidebarContext";
import { cn } from "@/lib/utils";

type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const menuItems: MenuItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/folders", label: "Folders", icon: Folder },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href) && href !== "/";
  };

  const handleClick = async (href: string) => {
    if (!isOpen) await setIsOpen(true);
    router.push(href);
  };

  return (
    <nav className="w-14 flex flex-col py-2 h-screen">
      <div className="flex flex-col items-center gap-2 p-3 w-full">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.href}
            onClick={() => handleClick(item.href)}
            className="
              group relative w-full p-3 flex flex-col items-center"
          >
            <div
              className={cn(
                "rounded-lg p-2 transition-colors group-hover:bg-gray-100",
                isActive(item.href) && "bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5 text-gray-700" />
            </div>
            <span className="mt-1 text-[11px] font-medium text-gray-600 truncate max-w-[64px] px-1">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
