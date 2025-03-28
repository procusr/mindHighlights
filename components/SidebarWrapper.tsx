"use client";

import type { ReactNode } from "react";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return <div className="h-full bg-background w-full">{children}</div>;
}
