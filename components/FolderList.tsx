import type { Folder } from "@/types/types"
import { FolderIcon } from "lucide-react"

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
    <ul className="space-y-2">
      {folders.map((folder) => (
        <li
          key={folder.id}
          className={`cursor-pointer p-2 rounded-md transition-colors duration-200 ${
            selectedFolder?.id === folder.id
              ? "bg-primary text-primary-foreground font-semibold"
              : "hover:bg-accent"
          }`}
          onClick={() => onFolderSelect(folder)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onFolderSelect(folder)
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <FolderIcon className="h-5 w-5" />
            <span>{folder.name}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default FolderList
