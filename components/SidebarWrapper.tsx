"use client";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full bg-background w-full">{children}</div>;
}
