"use client"

import { useState, useEffect, type Dispatch, type SetStateAction } from "react"
import { useSearchParams } from "next/navigation"
import type { Folder } from "@/types/types"
import Sidebar from "./Sidebar"
import ContentArea from "./ContentArea"
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext"

export default function UserContent({
  userId,
  initialFolders,
  selectedFolderId,
}: {
  userId: string
  initialFolders: Folder[]
  selectedFolderId?: string
}) {
  const [folders, setFolders] = useState(initialFolders)
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(
    initialFolders.find((f) => f.id === selectedFolderId) || null
  )
  const searchParams = useSearchParams()

  useEffect(() => {
    const folderId = searchParams.get("folderId")
    if (folderId) {
      const folder = folders.find((f) => f.id === folderId)
      setSelectedFolder(folder || null)
    } else {
      setSelectedFolder(null)
    }
  }, [searchParams, folders])

  return (
    <SidebarProvider>
      <UserContentInner
        userId={userId}
        folders={folders}
        setFolders={setFolders}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
      />
    </SidebarProvider>
  )
}

function UserContentInner({
  userId,
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
}: {
  userId: string
  folders: Folder[]
  setFolders: Dispatch<SetStateAction<Folder[]>>
  selectedFolder: Folder | null
  setSelectedFolder: Dispatch<SetStateAction<Folder | null>>
}) {
  const { menuOpen } = useSidebar()

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <ContentArea
          userId={userId}
          selectedFolder={selectedFolder}
          setFolders={setFolders}
          setSelectedFolder={setSelectedFolder}
        />
      </div>
    </div>
  )
}
