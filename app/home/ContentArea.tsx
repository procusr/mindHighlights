import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import AddNewContent from "./AddNewContent"
import type { Content, Folder } from "@/types/types"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Trash,
  Pencil,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Bomb,
  RefreshCw,
} from "lucide-react"
import { createClient } from "../../utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "react-responsive"
import ConfirmDialog from "../../components/ConfirmDialog"
import EditFolderDialog from "../../components/EditFolderDialog"

export default function ContentArea({
  selectedFolder,
  contentList,
  setContentList,
  userId,
  setFolders,
  setSelectedFolder,
}: {
  selectedFolder: Folder | null
  contentList: Content[]
  setContentList: React.Dispatch<React.SetStateAction<Content[]>>
  userId: string
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>
}) {
  const supabase = createClient()
  const [isDeleteContentDialogOpen, setIsContentDeleteDialogOpen] =
    useState(false)
  const [isDeleteFolderDialogOpen, setIsDeleteFolderDialogOpen] =
    useState(false)
  const [expandedContentId, setExpandedContentId] = useState<string | null>(
    null
  )

  const [newFolderName, setNewFolderName] = useState("")
  const [isEditFolderDialogOpen, setEditFolderDialogOpen] = useState(false)
  const [deletingContentId, setDeletingContentId] = useState<string | null>(
    null
  )
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [generatingMemoryId, setGeneratingMemoryId] = useState<string | null>(
    null
  )

  const handleToggleContent = (contentId: string) => {
    setExpandedContentId(expandedContentId === contentId ? null : contentId)
    setEditingContent(null)
  }

  const isMobile = useMediaQuery({ maxWidth: 767 })

  const handleEditContent = (content: Content) => {
    setEditingContent(content)
  }

  const handleDeleteFolder = async () => {
    const { error } = await supabase
      .from("user_folders")
      .delete()
      .eq("id", selectedFolder?.id)

    if (!error) {
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder.id !== selectedFolder?.id)
      )
      setSelectedFolder(null)
      setIsDeleteFolderDialogOpen(false)
    }
  }

  const handleEditFolder = async () => {
    if (newFolderName.trim() !== "") {
      const { data, error } = await supabase
        .from("user_folders")
        .update({ name: newFolderName })
        .eq("id", selectedFolder?.id)
        .select()

      if (!error && data) {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === selectedFolder?.id
              ? { ...folder, name: newFolderName }
              : folder
          )
        )
        setSelectedFolder((prevSelected) =>
          prevSelected ? { ...prevSelected, name: newFolderName } : prevSelected
        )
        setEditFolderDialogOpen(false)
      } else if (error) {
        console.error("Error updating folder:", error)
      }
    }
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
        setIsContentDeleteDialogOpen(false)
        setDeletingContentId(null)
        setExpandedContentId(null)
      } else {
        console.error("Error deleting content:", error)
      }
    }
  }

  const handleMemory = async (id: string, content: string) => {
    if (!content.trim()) return
    setGeneratingMemoryId(id)

    try {
      const response = await fetch("ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `Given the statement "${content}", using out of proportion exaggeration and substitution methods of memory to create a memorable phrase or sentence that captures the essence of the statement.`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate memory anchor")
      }

      const { generatedResponse } = await response.json()

      // Update the content item with the new anchor
      const { data, error } = await supabase
        .from("user_content")
        .update({ anchor: generatedResponse })
        .eq("id", id)
        .select()

      if (error) {
        throw new Error("Failed to update content with anchor")
      }

      // Update the local state
      setContentList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, anchor: generatedResponse } : item
        )
      )
    } catch (error) {
      console.error("Error generating or saving memory anchor:", error)
    } finally {
      setGeneratingMemoryId(null)
    }
  }

  return (
    <div className="w-full max-w-2xl p-4 sm:p-6">
      {selectedFolder ? (
        <>
          <div className="sticky top-0 bg-background z-10 flex justify-between items-center mb-4 p-2 shadow-sm rounded-b-sm fixed-container">
            <h2 className="text-xl font-semibold px-4">
              {selectedFolder.name}
            </h2>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-primary"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewFolderName(selectedFolder.name)
                      setEditFolderDialogOpen(true)
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setNewFolderName(selectedFolder.name)
                      setEditFolderDialogOpen(true)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteFolderDialogOpen(true)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AddNewContent
                selectedFolder={selectedFolder}
                userId={userId}
                setContentList={setContentList}
                contentList={contentList}
              >
                <Button variant="ghost" size="icon" className="text-primary">
                  <Plus className="h-6 w-6" />
                </Button>
              </AddNewContent>
            </div>
          </div>
          <div className="space-y-2">
            {contentList.length > 0 ? (
              contentList.map((content) => (
                <Card
                  key={content.id}
                  className="overflow-hidden pl-2 sm:pl-4 py-2 sm:py-3"
                >
                  <CardHeader
                    className="cursor-pointer p-2 flex flex-row items-center justify-between"
                    onClick={() => handleToggleContent(content.id)}
                  >
                    <CardTitle className="text-sm pr-2 font-medium">
                      {content.title.length > 170
                        ? `${content.title.slice(0, 170)}...`
                        : content.title}
                    </CardTitle>
                    {expandedContentId === content.id ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0" />
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
                          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap mb-4">
                            {content.content}
                          </p>
                          {content.anchor ? (
                            <div className="mt-2 mb-4 flex items-center">
                              <p className="text-sm italic text-gray-600 flex-grow">
                                {content.anchor}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleMemory(content.id, content.content)
                                }
                                aria-label="Regenerate memory anchor"
                                disabled={generatingMemoryId === content.id}
                                className="ml-2 p-1"
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-2 mb-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleMemory(content.id, content.content)
                                }
                                aria-label="Make me remember"
                                disabled={generatingMemoryId === content.id}
                              >
                                {generatingMemoryId === content.id ? (
                                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                                ) : (
                                  <Bomb className="h-3 w-3 mr-1" />
                                )}
                                Remember
                              </Button>
                            </div>
                          )}
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleEditContent(content)}
                              variant="outline"
                              size="sm"
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => {
                                setDeletingContentId(content.id)
                                setIsContentDeleteDialogOpen(true)
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash className="h-3 w-3 mr-1" />
                              Delete
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
        <p className="text-center text-gray-500">
          Select a folder to view content
        </p>
      )}

      <ConfirmDialog
        open={isDeleteContentDialogOpen}
        onOpenChange={setIsContentDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this content? This action cannot be undone."
        onConfirm={handleDeleteContent}
      />
      <ConfirmDialog
        open={isDeleteFolderDialogOpen}
        onOpenChange={setIsDeleteFolderDialogOpen}
        title="Confirm Folder Deletion"
        description="Are you sure you want to delete this folder? This action cannot be undone and will delete all content within the folder."
        onConfirm={handleDeleteFolder}
        isMobile={isMobile}
      />
      <EditFolderDialog
        open={isEditFolderDialogOpen}
        onOpenChange={setEditFolderDialogOpen}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onSave={handleEditFolder}
      />
    </div>
  )
}
