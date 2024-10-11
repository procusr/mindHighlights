import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { Folder } from "../../types/types"
import AddNewFolder from "./AddNewFolder"
import FolderList from "../../components/FolderList"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SidebarProps {
  folders: Folder[]
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  selectedFolder: Folder | null
  setSelectedFolder: (folder: Folder) => void
  userId: string
  menuOpen: boolean
}

export default function Sidebar({
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
  userId,
  menuOpen,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <aside
      className={`${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      } p-6 fixed left-0 top-16 bottom-0 z-40 w-80 bg-background transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 overflow-y-auto border-r border-border`}
      aria-labelledby="sidebar-heading"
    >
      <div className="flex flex-col h-full gap-2">
        <div className="sticky top-0 bg-background border-none z-10 flex justify-between items-center p-4 shadow-sm">
          <h2 id="sidebar-heading" className="text-md font-bold">
            Folders
          </h2>
          <AddNewFolder userId={userId} setFolders={setFolders}>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 p-0 text-primary"
              aria-label="Add new folder"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </AddNewFolder>
        </div>
        <Input
          id="folder-search-input"
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="my-3 px-2 py-2 rounded-xl focus:ring-primary border-border"
        />
        <div className="flex-grow overflow-y-auto p-3">
          <FolderList
            folders={filteredFolders}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
          />
        </div>
      </div>
    </aside>
  )
}
