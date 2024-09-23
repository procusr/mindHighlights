import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { Folder } from "../../types/types"
import AddNewFolder from "./AddNewFolder"
import FolderList from "../../components/FolderList"
import { createClient } from "../../utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/useMediaQuery"

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
      } p-2 fixed left-0 top-16 bottom-0 z-40 w-64 bg-white  transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 overflow-y-auto border-r border-gray-200 `}
    >
      <div className="p-2 ml-5 h-full flex flex-col">
        <div className="sticky top-0 bg-white border-none z-10 flex justify-between items-center mb-2 p-2 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Folders</h2>
          <AddNewFolder userId={userId} setFolders={setFolders}>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </AddNewFolder>
        </div>
        <Input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <div className="flex-grow overflow-y-auto">
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
