"use client"

import { useState, useTransition, startTransition } from "react"
import type { ReactNode } from "react"
import { useOptimistic } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Check, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Folder } from "@/types/types"
import { createNewFolder } from "../actions/contentActions"

interface AddNewFolderProps {
  children: ReactNode
  folders: Folder[]
}

export default function AddNewFolder({
  children,
  folders = [],
}: AddNewFolderProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle")

  const [optimisticFolders, addOptimisticFolder] = useOptimistic<Folder[]>(
    folders ?? [],
    (state, newFolder: Folder) => [...state, newFolder]
  )

  const handleCreateFolder = () => {
    if (!newFolderName.trim() || isPending) return

    const optimisticFolder: Folder = {
      id: `temp-${Date.now()}`,
      name: newFolderName,
      user_id: "",
      created_at: new Date().toISOString(),
    }

    startTransition(async () => {
      try {
        addOptimisticFolder(optimisticFolder)
        await createNewFolder(newFolderName)
        setStatus("success")
        setTimeout(() => {
          setIsOpen(false)
          setNewFolderName("")
          setStatus("idle")
        }, 1000)
      } catch (error) {
        setStatus("error")
        console.error("Failed to create folder:", error)
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isPending) {
          setIsOpen(open)
          if (!open) {
            setNewFolderName("")
            setStatus("idle")
          }
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogDescription>Enter a name for your new folder.</DialogDescription>
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Folder name"
          className={`transition-colors duration-200 ${
            status === "error" ? "border-red-500 focus:border-red-500" : ""
          }`}
          disabled={isPending || status === "success"}
        />
        <DialogFooter>
          <Button
            onClick={handleCreateFolder}
            disabled={
              isPending || status === "success" || !newFolderName.trim()
            }
            className="relative min-w-[100px] transition-all duration-200"
            variant={status === "error" ? "destructive" : "default"}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {status === "success" && <Check className="h-4 w-4 mr-2" />}
            {status === "error" && <AlertCircle className="h-4 w-4 mr-2" />}
            <span>
              {isPending && "Creating..."}
              {status === "success" && "Created!"}
              {status === "error" && "Try Again"}
              {!isPending && status === "idle" && "Create Folder"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
