import { useState, type ReactNode } from "react"
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

    // Generate title without repeating if it's shorter than 170 characters
    let title = content.trim().replace(/\s+/g, " ") // Remove extra whitespace
    title = title.slice(0, 170) // Limit to 170 characters

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
        <DialogContent className="sm:max-w-[425px] bg-card">
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
