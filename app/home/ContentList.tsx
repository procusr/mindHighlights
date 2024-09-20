import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StarOff, Edit, Trash } from "lucide-react"
import EditContentDialog from "./EditContentDialog"
import { createClient } from "../../utils/supabase/client"
import type { Content } from "@/types/types"

export default function ContentList({
  contentList,
  setContentList,
}: {
  contentList: Content[]
  setContentList: React.Dispatch<React.SetStateAction<Content[]>>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const supabase = createClient()

  async function deleteContent(id: string) {
    const { error } = await supabase.from("user_content").delete().eq("id", id)

    if (!error) {
      setContentList(contentList.filter((item: Content) => item.id !== id))
    }
  }

  return (
    <>
      <ul className="space-y-4">
        {contentList.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2 flex-1 mr-2 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  /* Toggle favorite logic */
                }}
                aria-label="Toggle Favorite"
                className="text-accent-foreground"
              >
                <StarOff className="h-4 w-4" />
              </Button>
              <span className="truncate break-words flex-1">
                {item.content}
              </span>
            </div>
            <div className="flex space-x-1 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setEditingId(item.id)
                  setIsEditDialogOpen(true)
                }}
                aria-label="Edit Content"
                className="text-primary-foreground"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => deleteContent(item.id)}
                aria-label="Delete Content"
                className="text-destructive-foreground"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <EditContentDialog
        editingId={editingId}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        contentList={contentList}
        setContentList={setContentList}
      />
    </>
  )
}
