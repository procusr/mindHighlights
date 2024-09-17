"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Edit, Plus, Star, StarOff, Trash, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import { createClient } from "../../utils/supabase/client"
import { Textarea } from "../../components/ui/textarea"
import { deleteFolder } from "./dataAccess"
import { useSidebar } from "../contexts/SidebarContext"

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
  const [folders, setFolders] = useState<Folder[]>([])
  const [newContent, setNewContent] = useState("")
  const [contentList, setContentList] = useState<Content[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { menuOpen, closeMenu } = useSidebar()

  const supabase = createClient()

  const isFavorite = false // Placeholder for favorite status

  useEffect(() => {
    fetchFolders()
  }, [])

  useEffect(() => {
    if (selectedFolder) {
      fetchContentList(selectedFolder.id)
      setActiveFolder(selectedFolder.id)
    }
  }, [selectedFolder])

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

  async function fetchFolders() {
    const { data, error } = await supabase
      .from("user_folders")
      .select("id, name")
      .eq("user_id", userId)

    if (data) {
      setFolders(data)
    }
  }

  async function deleteContent(id: string) {
    const { error } = await supabase.from("user_content").delete().eq("id", id)

    if (!error) {
      setContentList(contentList.filter((item) => item.id !== id))
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
      setIsFolderDialogOpen(false) // Close the dialog automatically
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu()
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [closeMenu])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector("aside")
      const menuButton = document.querySelector(
        'button[aria-label="Toggle menu"]'
      )
      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton !== event.target &&
        window.innerWidth < 768
      ) {
        closeMenu()
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [closeMenu])

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] bg-gray-50 relative">
        {/* Sidebar */}
        <aside
          id="sidebar" // Added ID for targeting
          className={`
            fixed top-0 left-0
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 transition-transform duration-200 ease-in-out
            z-50 w-64 h-full
            border-r border-gray-200 bg-white
            md:bg-gray-50
          `}
        >
          <nav className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-lg font-bold text-gray-800">
                Folders
              </CardTitle>
              <Dialog
                open={isFolderDialogOpen}
                onOpenChange={setIsFolderDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Enter the name of the new folder.
                  </DialogDescription>
                  <div className="mt-4">
                    <Label htmlFor="folder-name">Folder Name</Label>
                    <Input
                      id="folder-name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="e.g., Literature"
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={createNewFolder}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mb-4">
              <Input
                id="search-folder"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search folders..."
                className="w-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <ul className="flex-1 space-y-2 overflow-auto">
              {folders.map((folder) => (
                <li
                  key={folder.id}
                  className="flex items-center justify-between bg-white rounded-md p-2 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                >
                  <Button
                    variant={
                      selectedFolder?.id === folder.id ? "default" : "ghost"
                    }
                    className="flex-1 justify-start overflow-hidden text-gray-700 hover:text-gray-900"
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <span className="truncate">{folder.name}</span>
                  </Button>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {}}
                      aria-label="Toggle Favorite"
                      className="text-accent-foreground"
                    >
                      {isFavorite ? (
                        <Star className="h-4 w-4 text-accent" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (
                          window.confirm(
                            "Are you sure you want to delete this folder?"
                          )
                        )
                          deleteFolder(folder.id, () => {
                            setFolders(
                              folders.filter((f) => f.id !== folder.id)
                            )
                            if (activeFolder === folder.id) {
                              setActiveFolder(null)
                              setContentList([])
                            }
                          })
                      }}
                      aria-label="Delete Folder"
                      className="text-destructive-foreground"
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMenu}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                closeMenu()
              }
            }}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-auto bg-gray-50 w-full">
          <Card className="h-full bg-white shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-bold text-gray-800">
                {selectedFolder?.name || "Select a folder"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Add New Content */}
              {selectedFolder && (
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
              )}

              {/* Existing Contents */}
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
                        onClick={() => {}}
                        aria-label="Toggle Favorite"
                        className="text-accent-foreground"
                      >
                        {isFavorite ? (
                          <Star className="h-4 w-4 text-accent" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
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
                          setEditingContent(item.content)
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
            </CardContent>
          </Card>
        </main>

        {/* Edit Dialog */}
        {editingId && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-bg-red">
              <DialogTitle>Edit Content</DialogTitle>
              <DialogDescription>
                Modify the content below and save your changes.
              </DialogDescription>
              <div className="mt-4">
                <Label htmlFor="edit-content">Content Text</Label>
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full mb-4 break-words"
                  rows={6}
                />
              </div>
              <DialogFooter>
                <Button onClick={() => updateContent(editingId)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  )
}
