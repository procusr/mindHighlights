"use client"

import React, { useState, useEffect } from "react"
import { useSidebar } from "../contexts/SidebarContext"
import type { Folder } from "../../types/types"
import Sidebar from "./Sidebar"
import ContentArea from "./ContentArea"
import { useMediaQuery } from "react-responsive"

export default function UserContent({
  userId,
  initialFolders,
}: {
  userId: string
  initialFolders: Folder[]
}) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const { menuOpen, closeMenu } = useSidebar()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  useEffect(() => {
    if (!isMobile && !selectedFolder && folders.length > 0) {
      setSelectedFolder(folders[0])
    }
  }, [isMobile, selectedFolder, folders])

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder)
    if (isMobile) {
      closeMenu()
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <Sidebar
        folders={folders}
        setFolders={setFolders}
        selectedFolder={selectedFolder}
        setSelectedFolder={handleFolderSelect}
        userId={userId}
        menuOpen={menuOpen}
      />
      <div className="flex-1 overflow-y-auto">
        <ContentArea
          selectedFolder={selectedFolder}
          userId={userId}
          setFolders={setFolders}
          setSelectedFolder={setSelectedFolder}
        />
      </div>
    </div>
  )
}
