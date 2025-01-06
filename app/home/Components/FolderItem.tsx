// components/folders/folder-item.tsx
"use client";

import { useSidebar } from "@/app/contexts/SidebarContext";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

export function FolderItem({ folder }: { folder: any }) {
  const { setIsOpen } = useSidebar();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <Link
      href={`/folders/${folder.id}`}
      onClick={handleClick}
      className="block px-3 py-2 rounded-md text-sm
        text-muted-foreground hover:bg-accent hover:text-accent-foreground
        transition-colors"
    >
      {folder.name}
    </Link>
  );
}
