"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"

interface Folder {
  id: string
  name: string
}

interface Content {
  id: string
  content: string
  folder_id: string
}

export default function UserContent({ userId }: { userId: string }) {
  const [newContent, setNewContent] = useState("")
  const [contentList, setContentList] = useState<Content[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchFolders()
  }, [])

  useEffect(() => {
    if (activeFolder) {
      fetchContentList(activeFolder)
    }
  }, [activeFolder])

  async function fetchFolders() {
    const { data, error } = await supabase
      .from("user_folders")
      .select("id, name")
      .eq("user_id", userId)

    if (data) {
      setFolders(data)
    }
  }

  async function fetchContentList(folderId: string) {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("user_content")
        .select("id, content, folder_id")
        .eq("user_id", userId)
        .eq("folder_id", folderId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setContentList(data || [])
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function createNewFolder() {
    if (!newFolderName.trim()) return
    const { data, error } = await supabase
      .from("user_folders")
      .insert({ user_id: userId, name: newFolderName })
      .select()

    if (data) {
      setFolders([...folders, { id: data[0].id, name: data[0].name }])
      setNewFolderName("")
    }
  }

  async function deleteFolder(folderId: string) {
    const { error } = await supabase
      .from("user_folders")
      .delete()
      .eq("id", folderId)

    if (!error) {
      setFolders(folders.filter((f) => f.id !== folderId))
      if (activeFolder === folderId) {
        setActiveFolder(null)
        setContentList([])
      }
    }
  }

  async function saveNewContent() {
    if (!activeFolder) return
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from("user_content")
        .insert({
          user_id: userId,
          content: newContent,
          folder_id: activeFolder,
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

  async function updateContent(id: string) {
    setIsSaving(true)
    const { error } = await supabase
      .from("user_content")
      .update({ content: editingContent })
      .eq("id", id)

    if (!error) {
      setContentList(
        contentList.map((item) =>
          item.id === id ? { ...item, content: editingContent } : item
        )
      )
      setEditingId(null)
    }
    setIsSaving(false)
  }

  async function deleteContent(id: string) {
    const { error } = await supabase.from("user_content").delete().eq("id", id)

    if (!error) {
      setContentList(contentList.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="flex h-screen min-w-[60rem] gap-1 p-20">
      <div className="w-[250px] bg-gray-100 p-4 overflow-y-auto border-r border-gray-200">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          {isCreatingFolder ? (
            <div>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full mb-2 placeholder-gray-400"
              />
              <div className="flex justify-between">
                <Button
                  onClick={() => {
                    createNewFolder()
                    setIsCreatingFolder(false)
                  }}
                  disabled={!newFolderName.trim()}
                >
                  Create
                </Button>
                <Button
                  onClick={() => setIsCreatingFolder(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center content-center">
              <PlusIcon onClick={() => setIsCreatingFolder(true)} />
            </div>
          )}
        </div>
        <div className="space-y-2">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`p-2 rounded cursor-pointer ${activeFolder === folder.id ? "bg-blue-100" : "hover:bg-white"}`}
              onClick={() =>
                setActiveFolder(activeFolder === folder.id ? null : folder.id)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveFolder(activeFolder === folder.id ? null : folder.id)
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                  <FolderIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <div className="flex items-center">
                  {activeFolder === folder.id ? (
                    <ChevronDownIcon className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0" />
                  )}
                  <TrashIcon
                    className="h-5 w-5 ml-2 text-red-500 cursor-pointer flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (
                        window.confirm(
                          "Are you sure you want to delete this folder and all its contents?"
                        )
                      ) {
                        deleteFolder(folder.id)
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow p-6 overflow-y-auto border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Content</h2>

          {activeFolder ? (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Add New Content</h3>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full mb-4"
                rows={6}
                placeholder="Enter your new content here..."
              />
              <Button
                onClick={saveNewContent}
                disabled={isSaving || !newContent.trim()}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Select a folder to view or add content
            </p>
          )}

          {activeFolder && (
            <>
              <h3 className="text-xl font-semibold mb-2">Saved Content</h3>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-20 rounded mb-4" />
              ) : contentList.length === 0 ? (
                <p className="text-gray-500 italic">
                  No content in this folder yet
                </p>
              ) : (
                contentList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-md shadow mb-4 border border-gray-200"
                  >
                    {editingId === item.id ? (
                      <>
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full mb-4"
                          rows={6}
                        />
                        <Button
                          onClick={() => updateContent(item.id)}
                          disabled={isSaving}
                          className="mr-2"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="mb-4">{item.content}</p>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => {
                              setEditingId(item.id)
                              setEditingContent(item.content)
                            }}
                            className="mr-2"
                            variant="outline"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this content?"
                                )
                              ) {
                                deleteContent(item.id)
                              }
                            }}
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
