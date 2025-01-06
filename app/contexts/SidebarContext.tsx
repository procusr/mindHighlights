"use client";

import { useSidebarState } from "@/hooks/useSidebarState";
import { createContext, useContext } from "react";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => Promise<URLSearchParams>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useSidebarState();

  return (
    <SidebarContext.Provider
      value={{
        isOpen: isOpen ?? false,
        setIsOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}
