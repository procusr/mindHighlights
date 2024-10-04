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
import Markdown from "react-markdown"
import { Switch } from "@/components/ui/switch"
import { Label } from "../../components/ui/label"

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
  const [showInput, setShowInput] = useState(true)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit() {
    if (!content.trim()) return
    setIsLoading(true)

    try {
      const response = await fetch("/ai/generateTitle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate title")
      }

      const { titleQuestion } = await response.json()

      const { data, error } = await supabase
        .from("user_content")
        .insert({
          user_id: userId,
          folder_id: selectedFolder.id,
          title: titleQuestion || stripMarkdown(content.slice(0, 170)), // Fallback to stripped content if title generation fails
          content,
          ...(title && { title }),
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
          <DialogHeader className="flex-col justify-between gap-2">
            <DialogTitle>Add New Content</DialogTitle>
            <div className="flex items-center space-x-2">
              <Label className="text-xs">
                Generate Title in a form of question
              </Label>
              <Switch
                checked={showInput}
                onClick={() => setShowInput((prev) => !prev)}
              />
            </div>
          </DialogHeader>
          {!showInput && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your title here..."
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          )}
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              className="min-h-[200px]"
            />
            <Markdown>{content}</Markdown>
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
