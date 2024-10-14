import { useState } from "react"
import type { Folder } from "@/types/types"
import { ChevronRight } from "lucide-react"

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
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)

  return (
    <ul className="space-y-1">
      {folders.map((folder) => {
        const isSelected = selectedFolder?.id === folder.id
        const isHovered = hoveredFolder === folder.id

        return (
          <li
            key={folder.id}
            className={`
              relative cursor-pointer transition-all duration-200
              ${
                isSelected
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent/50"
              }
            `}
            onClick={() => onFolderSelect(folder)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onFolderSelect(folder)
              }
            }}
            onMouseEnter={() => setHoveredFolder(folder.id)}
            onMouseLeave={() => setHoveredFolder(null)}
            tabIndex={0}
          >
            <div className="flex items-center py-2 px-3 overflow-hidden">
              <span className="truncate flex-grow" title={folder.name}>
                {folder.name}
              </span>
              {(isSelected || isHovered) && (
                <ChevronRight className="h-4 w-4 flex-shrink-0 ml-2 text-primary/70" />
              )}
            </div>
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default FolderList
