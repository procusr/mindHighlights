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
import { stripMarkdown } from "../../utils/utils"

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
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit() {
    if (!content.trim()) return
    setIsLoading(true)

    try {
      const response = await fetch("/api/generateTitle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate title")
      }

      const { title } = await response.json()

      console.log("Generated title:", title)

      // Insert content with generated title
      const { data, error } = await supabase
        .from("user_content")
        .insert({
          user_id: userId,
          folder_id: selectedFolder.id,
          title: title || stripMarkdown(content.slice(0, 170)), // Fallback to stripped content if title generation fails
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
    } catch (error) {
      console.error("Error generating title or saving content:", error)
    } finally {
      setIsLoading(false)
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
            {/* Remove ReactMarkdown preview for simplicity */}
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddNewContent
