"use client";

import { useSidebar } from "@/app/contexts/SidebarContext";
import { useUser } from "@/app/contexts/UserProvider";
import { SubmitButton } from "@/components/submit-button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Folder, Home, Search, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { signOutAction } from "../actions";

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
  const { setIsOpen } = useSidebar();
  const { isLoggedIn, user } = useUser();

  if (!isLoggedIn) return null;

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href) && href !== "/";
  };

  const handleClick = (href: string) => {
    setIsOpen(true);
    document.getElementById("sidebar")?.setAttribute("data-state", "open");
    router.push(href);
  };

  return (
    <nav
      className={cn(
        "w-[64px] h-dvh fixed left-0 mt-2 z-30 flex flex-col  items-center rounded-md"
      )}
    >
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
      {isLoggedIn && (
        <Menubar className="bg-zinc-300 border-none fixed bottom-4 ">
          <MenubarMenu>
            <MenubarTrigger className="size-8 flex items-center justify-center rounded-full bg-primary text-white text-sm sm:text-base self-end cursor-pointer">
              {user?.email?.charAt(0).toUpperCase()}
            </MenubarTrigger>
            <MenubarContent className="w-48 max-w-full">
              <MenubarItem className="text-gray-700">{user?.email}</MenubarItem>
              <MenubarSeparator />
              <form action={signOutAction}>
                <SubmitButton
                  className="w-full text-left  py-2 hover:bg-gray-100"
                  variant="text"
                  size="sm"
                >
                  Sign out
                </SubmitButton>
              </form>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </nav>
  );
}
