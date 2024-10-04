import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "@radix-ui/react-label"
import { createClient } from "../../utils/supabase/client"
import type { Content } from "@/types/types"

interface EditContentDialogProps {
  editingId: string | null
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  contentList: Content[]
  setContentList: React.Dispatch<React.SetStateAction<Content[]>>
}

export default function EditContentDialog({
  editingId,
  isOpen,
  setIsOpen,
  contentList,
  setContentList,
}: EditContentDialogProps) {
  const [editingContent, setEditingContent] = useState("")
  const supabase = createClient()

  useEffect(() => {
    if (editingId) {
      const content = contentList.find((item) => item.id === editingId)
      if (content) {
        setEditingContent(content.content)
      }
    }
  }, [editingId, contentList])

  async function updateContent(id: string) {
    const { error } = await supabase
      .from("user_content")
      .update({ content: editingContent })
      .eq("id", id)

    if (!error) {
      setContentList(
        contentList.map((item) =>
          item.id === id ? { ...item, content: editingContent } : item
        )
      )
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-red">
        <DialogTitle>Edit Content</DialogTitle>
        <DialogDescription>
          Modify the content below and save your changes.
        </DialogDescription>
        <div className="mt-4">
          <Label htmlFor="edit-content">Content Text</Label>
          <Textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full mb-4 break-words"
            rows={7}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => editingId && updateContent(editingId)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
