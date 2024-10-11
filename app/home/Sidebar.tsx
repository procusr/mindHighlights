import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import type { Folder } from "../../types/types"
import AddNewFolder from "./AddNewFolder"
import FolderList from "../../components/FolderList"
import { Button } from "@/components/ui/button"
import { Plus, Search, FolderIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "../contexts/SidebarContext"

interface SidebarProps {
  folders: Folder[]
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  selectedFolder: Folder | null
  setSelectedFolder: (folder: Folder) => void
  userId: string
}

export default function Sidebar({
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
  userId,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { menuOpen, closeMenu } = useSidebar()

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [closeMenu])

  return (
    <aside
      className={`${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-background to-background/95 transition-transform duration-300 ease-in-out md:static md:translate-x-0 border-r border-border flex flex-col`}
      aria-labelledby="sidebar-heading"
    >
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b border-border">
        <h2
          id="sidebar-heading"
          className="text-xl font-bold text-primary mb-4 flex items-center"
        >
          <FolderIcon className="mr-2 h-6 w-6" />
          Folders
        </h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="folder-search-input"
            type="text"
            placeholder="Search folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full focus:ring-primary border-border bg-background/50"
          />
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="px-4 py-6">
          <FolderList
            folders={filteredFolders}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
          />
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border">
        <AddNewFolder userId={userId} setFolders={setFolders}>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Folder
          </Button>
        </AddNewFolder>
      </div>
    </aside>
  )
}
