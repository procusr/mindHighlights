"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateContent } from "../actions/contentActions"
import type { Content } from "@/types/types"

interface EditContentDialogProps {
  content: Content | null
  isOpen: boolean
  onClose: () => void
  folderId: string
}

export default function EditContentDialog({
  content,
  isOpen,
  onClose,
  folderId,
}: EditContentDialogProps) {
  const [editedContent, setEditedContent] = useState<Content | null>(null)

  useEffect(() => {
    setEditedContent(content)
  }, [content])

  const handleSave = async () => {
    if (editedContent) {
      await updateContent(
        editedContent.id,
        editedContent.title ?? "",
        editedContent.content ?? "",
        folderId
      )
      onClose()
    }
  }

  if (!editedContent) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>
        <Input
          value={editedContent.title ?? ""}
          onChange={(e) =>
            setEditedContent({ ...editedContent, title: e.target.value })
          }
          placeholder="Enter title"
          className="mb-2"
        />
        <Textarea
          value={editedContent.content ?? ""}
          onChange={(e) =>
            setEditedContent({ ...editedContent, content: e.target.value })
          }
          placeholder="Enter content"
          className="min-h-[100px] mb-2"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
