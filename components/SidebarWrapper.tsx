"use client";

import type { ReactNode } from "react";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return <div className="size-full bg-background">{children}</div>;
}
