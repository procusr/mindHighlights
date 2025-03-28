"use client";

import { useSidebar } from "@/app/contexts/SidebarContext";
import type { Folder } from "@/types/types";
import { useMediaQuery } from "react-responsive";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function FolderItem({ folder }: { folder: Folder }) {
  const { setIsOpen } = useSidebar();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const router = useRouter();

  const queryString = useParams().query ? `query=${useParams().query}` : "";

  const handleClick = async () => {
    if (isMobile) {
      setIsOpen(false);
    }

    router.push(
      `/folders/${folder.id}${queryString ? `?${queryString}` : ""}`,
      {
        scroll: false,
      }
    );
  };

  const isSelected = useParams().folderId === folder.id;

  return (
    <Button
      onClick={handleClick}
      variant={isSelected ? "outline" : "text"}
      className="w-full p-2 text-left justify-start transition-colors rounded-sm"
    >
      {folder.name}
    </Button>
  );
}
