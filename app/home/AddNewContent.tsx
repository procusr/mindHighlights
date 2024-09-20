import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "@radix-ui/react-label"
import { createClient } from "../../utils/supabase/client"
import type { Content } from "@/types/types"

export default function AddNewContent({
  selectedFolder,
  setContentList,
  userId,
  contentList,
}: {
  selectedFolder: { id: string; name: string } | null
  setContentList: React.Dispatch<React.SetStateAction<Content[]>>
  userId: string
  contentList: Content[]
}) {
  const [newContent, setNewContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  async function saveNewContent() {
    if (!selectedFolder) return
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from("user_content")
        .insert({
          user_id: userId,
          content: newContent,
          folder_id: selectedFolder.id,
        })
        .select()

      if (error) throw error

      if (data) {
        setContentList([data[0], ...contentList])
        setNewContent("")
      }
    } catch (error) {
      console.error("Error saving new content:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mb-8">
      <Label
        htmlFor="new-content"
        className="block mb-2 text-lg font-semibold text-gray-700"
      >
        Add New Content
      </Label>
      <Textarea
        id="new-content"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        rows={6}
        className="w-full mb-3 break-words bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter your new content here..."
      />
      <Button
        onClick={saveNewContent}
        disabled={isSaving || !newContent.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  )
}
