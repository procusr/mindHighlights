"use client";

import Link from "next/link";
import type { Folder } from "@/types/types";
import { cn } from "@/lib/utils";

interface FolderListProps {
  folders: Folder[];
  folderId: string;
}

export default function FolderList({ folders, folderId }: FolderListProps) {
  return (
    <ul className="space-y-0.5">
      {folders.map((folder) => {
        const isSelected = folderId === folder.id;

        return (
          <li
            key={folder.id}
            className={cn(
              "relative transition-all duration-200",
              isSelected
                ? "sidebar-item depth-shadow bg-primary/10 text-primary font-medium"
                : "hover:bg-primary/10"
            )}
          >
            <Link
              href={`/home?folderId=${folder.id}`}
              className="block py-1.5 px-3"
              prefetch={true}
            >
              <div className="flex items-center">
                <span className="truncate flex-grow" title={folder.name}>
                  {folder.name}
                </span>
              </div>
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
