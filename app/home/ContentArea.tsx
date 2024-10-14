"use client"

import { useState, useEffect } from "react"
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
  MoreVertical,
  Edit,
  Delete,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "react-responsive"
import ConfirmDialog from "../../components/ConfirmDialog"
import EditFolderDialog from "../../components/EditFolderDialog"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

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
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto max-w-3xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {selectedFolder ? (
            <>
              <div className="sticky top-0  z-10 pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 sm:mb-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <h2 className="text-lg sm:text-2xl font-bold text-primary truncate max-w-[calc(100%-2rem)]">
                      {selectedFolder.name}
                    </h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary hover:bg-accent p-1"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setNewFolderName(selectedFolder.name)
                            setEditFolderDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsDeleteFolderDialogOpen(true)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Folder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <AddNewContent
                    selectedFolder={selectedFolder}
                    userId={userId}
                    setContentList={setContentList}
                    contentList={contentList}
                  >
                    <Button
                      variant="default"
                      size="sm"
                      className="hover:bg-primary/90 w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Highlight
                    </Button>
                  </AddNewContent>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {contentList?.length > 0 ? (
                  contentList.map((content) => (
                    <motion.div
                      key={content.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className="overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer"
                        onClick={() => handleToggleContent(content.id)}
                      >
                        <CardHeader className="p-4 bg-gradient-to-r from-secondary/30 to-primary/10 relative">
                          <div className="flex justify-between items-center w-full">
                            <CardTitle className="text-sm font-medium break-words mr-2 flex-grow">
                              {content.title}
                            </CardTitle>
                            <div className="flex items-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary p-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditContent(content)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDeletingContentId(content.id)
                                      setIsContentDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Delete className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardHeader>
                        <AnimatePresence>
                          {expandedContentId === content.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CardContent className="p-4 bg-gradient-to-b from-transparent to-secondary/10">
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
                                      <Button
                                        onClick={handleSaveEdit}
                                        size="sm"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap mb-4">
                                      <span className="bg-highlight">
                                        {content.content}
                                      </span>
                                    </p>
                                    {content.anchor && (
                                      <div className="mt-4 p-3 bg-primary/5 rounded-md">
                                        <div className="flex items-center justify-between">
                                          <p className="text-sm italic text-muted-foreground flex-grow mr-2">
                                            {content.anchor}
                                          </p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleMemory(
                                                content.id,
                                                content.content
                                              )
                                            }}
                                            disabled={
                                              generatingMemoryId === content.id
                                            }
                                            className="flex-shrink-0"
                                          >
                                            <Sparkles className="h-3 w-3 mr-2" />
                                            Refresh Memory
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    This folder is empty. Add some highlights to get started!
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
              <p className="text-center text-muted-foreground mb-4 px-4">
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
        </div>
      </div>

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
