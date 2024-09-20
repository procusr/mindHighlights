import React from "react"
import type { Folder } from "../types/types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"

interface FolderListProps {
  folders: Folder[]
  selectedFolder: Folder | null
  onFolderSelect: (folder: Folder) => void
  onEditFolder: (folder: Folder) => void
  onDeleteFolder: (folderId: string) => void
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onEditFolder,
  onDeleteFolder,
}) => {
  return (
    <ul className="space-y-1">
      {folders.map((folder) => (
        <li
          key={folder.id}
          className={`flex items-center justify-between py-1 px-1 rounded ${
            selectedFolder?.id === folder.id
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <button
            onClick={() => onFolderSelect(folder)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onFolderSelect(folder)
              }
            }}
            className="flex-grow text-left text-sm truncate mr-1 bg-inherit"
            type="button"
          >
            {folder.name}
          </button>
          <div className="flex space-x-0.5 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onEditFolder(folder)
              }}
              aria-label={`Edit ${folder.name}`}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteFolder(folder.id)
              }}
              aria-label={`Delete ${folder.name}`}
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default FolderList
