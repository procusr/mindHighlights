"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <SidebarContext value={{ menuOpen, toggleMenu, closeMenu }}>
      {children}
    </SidebarContext>
  );
};

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
