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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)
  const supabase = createClient()

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditFolder = async (folder: Folder) => {
    const newName = prompt("Enter new folder name", folder.name)
    if (newName && newName !== folder.name) {
      const { data, error } = await supabase
        .from("user_folders")
        .update({ name: newName })
        .eq("id", folder.id)
        .select()

      if (data) {
        setFolders(
          folders.map((f) => (f.id === folder.id ? { ...f, name: newName } : f))
        )
      }
    }
  }

  const handleDeleteFolder = async () => {
    if (deletingFolderId) {
      const { error } = await supabase
        .from("user_folders")
        .delete()
        .eq("id", deletingFolderId)

      if (!error) {
        setFolders(folders.filter((f) => f.id !== deletingFolderId))
        if (selectedFolder?.id === deletingFolderId) {
          setSelectedFolder(undefined as unknown as Folder)
        }
        setIsDeleteDialogOpen(false)
        setDeletingFolderId(null)
      }
    }
  }

  return (
    <aside
      className={`${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      } fixed left-0 top-16 bottom-0 z-40 w-64 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Folders</h2>
          <AddNewFolder userId={userId} setFolders={setFolders}>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </AddNewFolder>
        </div>
        <Input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="flex-grow overflow-y-auto">
          <FolderList
            folders={filteredFolders}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            onEditFolder={handleEditFolder}
            onDeleteFolder={(folderId) => {
              setDeletingFolderId(folderId)
              setIsDeleteDialogOpen(true)
            }}
          />
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Folder Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this folder? This action cannot be
            undone and will delete all content within the folder.
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteFolder} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
