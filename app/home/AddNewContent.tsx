import React, { useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "../../utils/supabase/client"
import type { Content } from "@/types/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddNewContentProps {
  selectedFolder: { id: string; name: string }
  userId: string
  setContentList: React.Dispatch<React.SetStateAction<Content[]>>
  contentList: Content[]
  children: ReactNode
}

const AddNewContent: React.FC<AddNewContentProps> = ({
  selectedFolder,
  userId,
  setContentList,
  contentList,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const supabase = createClient()

  async function handleSubmit() {
    if (!content.trim()) return

    // Generate title with a minimum length of 170 characters
    let title = content.trim().replace(/\s+/g, " ") // Remove extra whitespace
    if (title.length < 170) {
      // If the content is shorter than 170 characters, repeat it
      title = title.padEnd(170, " " + title)
    }
    title = title.slice(0, 170) // Ensure it's exactly 170 characters

    const { data, error } = await supabase
      .from("user_content")
      .insert({
        user_id: userId,
        folder_id: selectedFolder.id,
        title,
        content,
      })
      .select()

    if (data) {
      setContentList([...contentList, data[0] as Content])
      setContent("")
      setIsOpen(false)
    } else if (error) {
      console.error("Error adding content:", error)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddNewContent
