import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Plus, Star, StarOff, Trash } from "lucide-react"
import { deleteFolder } from "./dataAccess"
import type { Folder } from "../../types/types"
import { createClient } from "../../utils/supabase/client"

export default function Sidebar({
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
  menuOpen,
  userId,
}: {
  folders: Folder[]
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  selectedFolder: Folder | null
  setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>
  menuOpen: boolean
  userId: string
}) {
  const [newFolderName, setNewFolderName] = useState("")
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  async function createNewFolder() {
    if (!newFolderName.trim()) return
    const { data, error } = await supabase
      .from("user_folders")
      .insert({ user_id: userId, name: newFolderName })
      .select()

    if (data) {
      setFolders([...folders, { id: data[0].id, name: data[0].name }])
      setNewFolderName("")
      setIsFolderDialogOpen(false) // Close the dialog automatically
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-in-out z-50 w-64 h-full border-r border-gray-200 bg-white md:bg-gray-50`}
    >
      <nav className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Folders</h2>
          <Dialog
            open={isFolderDialogOpen}
            onOpenChange={setIsFolderDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter the name of the new folder.
              </DialogDescription>
              <div className="mt-4">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Literature"
                />
              </div>
              <DialogFooter>
                <Button onClick={createNewFolder}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search folders..."
          className="mb-4"
        />
        <ul className="space-y-2 overflow-auto flex-1">
          {folders.map((folder) => (
            <li key={folder.id} className="flex items-center justify-between">
              <Button
                variant={selectedFolder?.id === folder.id ? "default" : "ghost"}
                className="flex-1 justify-start"
                onClick={() => setSelectedFolder(folder)}
              >
                {folder.name}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  deleteFolder(folder.id, () =>
                    setFolders(folders.filter((f) => f.id !== folder.id))
                  )
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
