import { cn } from "../lib/utils"
import type { Folder } from "../types/types"
import { Button } from "@/components/ui/button"

interface FolderListProps {
  folders: Folder[]
  selectedFolder: Folder | null
  onFolderSelect: (folder: Folder) => void
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
}) => {
  return (
    <ul className="space-y-1">
      {folders.map((folder) => (
        <li
          key={folder.id}
          className={cn(
            "rounded-md",
            selectedFolder?.id === folder.id
              ? "bg-gray-200 "
              : "hover:bg-gray-100"
          )}
        >
          <Button
            size="sm"
            variant="ghost"
            className="flex-grow justify-start text-left text-sm truncate bg-inherit w-full"
            onClick={() => onFolderSelect(folder)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onFolderSelect(folder)
              }
            }}
            type="button"
          >
            {folder.name}
          </Button>
        </li>
      ))}
    </ul>
  )
}

export default FolderList
