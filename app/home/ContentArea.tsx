"use client"

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
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "react-responsive"
import ConfirmDialog from "../../components/ConfirmDialog"
import EditFolderDialog from "../../components/EditFolderDialog"
import { useEffect } from "react"
import {
  fetchContentForFolder,
  updateContent,
  deleteContent,
  updateFolder,
  deleteFolder,
  generateMemoryAnchor,
  updateContentAnchor,
} from "../actions/contentActions"
import AddNewFolder from "./AddNewFolder"

export default function ContentArea({
  selectedFolder,
  userId,
  setFolders,
  setSelectedFolder,
}: {
  selectedFolder: Folder | null
  userId: string
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>
}) {
  const [contentList, setContentList] = useState<Content[]>([])
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

  const isMobile = useMediaQuery({ maxWidth: 767 })

  useEffect(() => {
    if (selectedFolder) {
      fetchContentForFolder(selectedFolder.id, userId)
        .then(setContentList)
        .catch(console.error)
    }
  }, [selectedFolder, userId])

  const handleToggleContent = (contentId: string) => {
    setExpandedContentId(expandedContentId === contentId ? null : contentId)
    setEditingContent(null)
  }

  const handleEditContent = (content: Content) => {
    setEditingContent(content)
  }

  const handleDeleteFolder = async () => {
    if (selectedFolder) {
      try {
        await deleteFolder(selectedFolder.id)
        setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.id !== selectedFolder.id)
        )
        setSelectedFolder(null)
        setIsDeleteFolderDialogOpen(false)
      } catch (error) {
        console.error("Error deleting folder:", error)
      }
    }
  }

  const handleEditFolder = async () => {
    if (selectedFolder && newFolderName.trim() !== "") {
      try {
        const updatedFolder = await updateFolder(
          selectedFolder.id,
          newFolderName
        )
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === selectedFolder.id ? updatedFolder : folder
          )
        )
        setSelectedFolder(updatedFolder)
        setEditFolderDialogOpen(false)
      } catch (error) {
        console.error("Error updating folder:", error)
      }
    }
  }

  const handleSaveEdit = async () => {
    if (editingContent) {
      try {
        const updatedContent = await updateContent(
          editingContent.id,
          editingContent.title,
          editingContent.content
        )
        setContentList(
          contentList.map((c) =>
            c.id === updatedContent.id ? updatedContent : c
          )
        )
        setEditingContent(null)
      } catch (error) {
        console.error("Error updating content:", error)
      }
    }
  }

  const handleDeleteContent = async () => {
    if (deletingContentId) {
      try {
        await deleteContent(deletingContentId)
        setContentList(contentList.filter((c) => c.id !== deletingContentId))
        setIsContentDeleteDialogOpen(false)
        setDeletingContentId(null)
        setExpandedContentId(null)
      } catch (error) {
        console.error("Error deleting content:", error)
      }
    }
  }

  const handleMemory = async (id: string, content: string) => {
    if (!content.trim()) return
    setGeneratingMemoryId(id)

    try {
      const anchor = await generateMemoryAnchor(content)
      const updatedContent = await updateContentAnchor(id, anchor)
      setContentList((prevList) =>
        prevList.map((item) => (item.id === id ? updatedContent : item))
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
          <div className="sticky top-0 bg-background z-10 flex justify-between items-center mb-6 p-4 rounded-lg shadow-sm border-b border-primary/20">
            <h2 className="text-2xl font-bold text-primary">
              {selectedFolder.name}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewFolderName(selectedFolder.name)
                  setEditFolderDialogOpen(true)
                }}
                className="text-muted-foreground hover:text-primary"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteFolderDialogOpen(true)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <AddNewContent
                selectedFolder={selectedFolder}
                userId={userId}
                setContentList={setContentList}
                contentList={contentList}
              >
                <Button variant="default" size="sm" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </AddNewContent>
            </div>
          </div>
          <div className="space-y-6">
            {contentList.length > 0 ? (
              contentList.map((content) => (
                <Card
                  key={content.id}
                  className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                >
                  <CardHeader
                    className="cursor-pointer p-4 flex flex-row items-center justify-between bg-secondary/50"
                    onClick={() => handleToggleContent(content.id)}
                  >
                    <CardTitle className="text-sm font-medium">
                      {content.title.length > 100
                        ? `${content.title.slice(0, 100)}...`
                        : content.title}
                    </CardTitle>
                    {expandedContentId === content.id ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-primary" />
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
                            placeholder="Enter title"
                            className="input mb-2"
                          />
                          <Textarea
                            value={editingContent.content}
                            onChange={(e) =>
                              setEditingContent({
                                ...editingContent,
                                content: e.target.value,
                              })
                            }
                            placeholder="Enter content"
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
                          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap mb-4 prose">
                            <span className="highlight">{content.content}</span>
                          </p>
                          {content.anchor && (
                            <div className="mt-2 mb-4 flex items-center">
                              <p className="text-sm italic text-muted-foreground flex-grow">
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
                                className="ml-2 p-1 hover:text-primary"
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleEditContent(content)}
                              variant="outline"
                              size="sm"
                              className="hover:text-primary"
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
              <p className="text-center text-muted-foreground">
                This folder is empty. Add some highlights to get started!
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-muted-foreground mb-4">
            Select a folder to view your highlights or create a new one
          </p>
          <AddNewFolder userId={userId} setFolders={setFolders}>
            <Button variant="outline" onClick={() => {}}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Folder
            </Button>
          </AddNewFolder>
        </div>
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
