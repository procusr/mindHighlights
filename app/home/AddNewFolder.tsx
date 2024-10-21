"use client"

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

import { createNewFolder } from "../actions/contentActions"

interface AddNewFolderProps {
  children: ReactNode
}

const AddNewFolder: React.FC<AddNewFolderProps> = ({ children }) => {
  const [newFolderName, setNewFolderName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogDescription>Enter a name for your new folder.</DialogDescription>
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Folder name"
        />
        <DialogFooter>
          <Button
            onClick={async () => {
              createNewFolder(newFolderName)
              setIsOpen(false)
              setNewFolderName("")
            }}
          >
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewFolder
