import { useState } from "react"
import type { ReactNode } from "react"
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
import { createClient } from "../../utils/supabase/client"
import type { Folder } from "../../types/types"

interface AddNewFolderProps {
  userId: string
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  children: ReactNode
}

const AddNewFolder: React.FC<AddNewFolderProps> = ({
  userId,
  setFolders,
  children,
}) => {
  const [newFolderName, setNewFolderName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  async function createNewFolder() {
    if (!newFolderName.trim()) return
    const { data, error } = await supabase
      .from("user_folders")
      .insert({ user_id: userId, name: newFolderName })
      .select()

    if (data) {
      setFolders((prevFolders) => [
        ...prevFolders,
        { id: data[0].id, name: data[0].name },
      ])
      setNewFolderName("")
      setIsOpen(false)
    } else if (error) {
      console.error("Error creating folder:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogDescription>Enter a name for your new folder.</DialogDescription>
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Folder name"
        />
        <DialogFooter>
          <Button onClick={createNewFolder}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewFolder
