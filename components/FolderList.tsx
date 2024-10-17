"use client"

import { useRouter } from "next/navigation"
import type { Folder } from "@/types/types"

interface FolderListProps {
  folders: Folder[]
  selectedFolderId?: string
  onFolderSelect: (folderId: string) => void
}

export default function FolderList({
  folders,
  selectedFolderId,
  onFolderSelect,
}: FolderListProps) {
  const router = useRouter()

  const handleFolderClick = (folderId: string) => {
    onFolderSelect(folderId)
    router.push(`/home?folderId=${folderId}`)
  }

  return (
    <ul className="space-y-1">
      {folders.map((folder) => {
        const isSelected = selectedFolderId === folder.id

        return (
          <li
            key={folder.id}
            className={`
              relative cursor-pointer transition-all duration-200
              ${isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50"}
            `}
            onClick={() => handleFolderClick(folder.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleFolderClick(folder.id)
              }
            }}
            tabIndex={0}
            aria-selected={isSelected}
          >
            <div className="flex items-center py-2 px-3">
              <span className="truncate flex-grow" title={folder.name}>
                {folder.name}
              </span>
            </div>
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}
          </li>
        )
      })}
    </ul>
  )
}
