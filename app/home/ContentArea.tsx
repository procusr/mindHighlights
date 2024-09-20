import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import AddNewContent from "./AddNewContent"
import type { Content } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Plus, Trash, Pencil, ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "../../utils/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContentArea({
  selectedFolder,
  contentList,
  setContentList,
  userId,
}: {
  selectedFolder: { id: string; name: string } | null
  contentList: Content[]
  setContentList: React.Dispatch<React.SetStateAction<Content[]>>
  userId: string
}) {
  const supabase = createClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [expandedContentId, setExpandedContentId] = useState<string | null>(
    null
  )
  const [deletingContentId, setDeletingContentId] = useState<string | null>(
    null
  )
  const [editingContent, setEditingContent] = useState<Content | null>(null)

  const handleToggleContent = (contentId: string) => {
    setExpandedContentId(expandedContentId === contentId ? null : contentId)
    setEditingContent(null)
  }

  const handleEditContent = (content: Content) => {
    setEditingContent(content)
  }

  const handleSaveEdit = async () => {
    if (editingContent) {
      const { data, error } = await supabase
        .from("user_content")
        .update({
          title: editingContent.title,
          content: editingContent.content,
        })
        .eq("id", editingContent.id)
        .select()

      if (data) {
        setContentList(
          contentList.map((c) =>
            c.id === editingContent.id ? { ...editingContent } : c
          )
        )
        setEditingContent(null)
      } else if (error) {
        console.error("Error updating content:", error)
      }
    }
  }

  const handleDeleteContent = async () => {
    if (deletingContentId) {
      const { error } = await supabase
        .from("user_content")
        .delete()
        .eq("id", deletingContentId)

      if (!error) {
        setContentList(contentList.filter((c) => c.id !== deletingContentId))
        setIsDeleteDialogOpen(false)
        setDeletingContentId(null)
        setExpandedContentId(null)
      } else {
        console.error("Error deleting content:", error)
      }
    }
  }

  return (
    <div className="w-full max-w-3xl p-4 sm:p-6">
      {selectedFolder ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{selectedFolder.name}</h2>
            <AddNewContent
              selectedFolder={selectedFolder}
              userId={userId}
              setContentList={setContentList}
              contentList={contentList}
            >
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </AddNewContent>
          </div>
          <div className="space-y-2">
            {contentList.length > 0 ? (
              contentList.map((content) => (
                <Card key={content.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer p-4 flex flex-row items-center justify-between"
                    onClick={() => handleToggleContent(content.id)}
                  >
                    <CardTitle className="text-sm pr-8">
                      {content.title.length > 170
                        ? `${content.title.slice(0, 170)}...`
                        : content.title}
                    </CardTitle>
                    {expandedContentId === content.id ? (
                      <ChevronUp className="h-6 w-6 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-6 w-6 flex-shrink-0" />
                    )}
                  </CardHeader>
                  {expandedContentId === content.id && (
                    <CardContent className="p-4">
                      {editingContent?.id === content.id ? (
                        <>
                          <Input
                            value={editingContent.title}
                            onChange={(e) =>
                              setEditingContent({
                                ...editingContent,
                                title: e.target.value,
                              })
                            }
                            placeholder="Title"
                            className="mb-2"
                          />
                          <Textarea
                            value={editingContent.content}
                            onChange={(e) =>
                              setEditingContent({
                                ...editingContent,
                                content: e.target.value,
                              })
                            }
                            placeholder="Content"
                            className="min-h-[100px] mb-2"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => setEditingContent(null)}
                              variant="outline"
                              size="sm"
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEdit} size="sm">
                              Save
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-4">{content.content}</p>
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleEditContent(content)}
                              variant="outline"
                              size="sm"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setDeletingContentId(content.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No content in this folder. Add some!
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Select a folder to view content
        </p>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this content? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteContent} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
