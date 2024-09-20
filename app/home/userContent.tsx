"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "../../utils/supabase/client"
import { useSidebar } from "../contexts/SidebarContext"
import type { Content, Folder } from "../../types/types"
import Sidebar from "./Sidebar"
import ContentArea from "./ContentArea"
import { useMediaQuery } from "react-responsive"

export default function UserContent({ userId }: { userId: string }) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [contentList, setContentList] = useState<Content[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const { menuOpen, closeMenu } = useSidebar()
  const supabase = createClient()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  useEffect(() => {
    fetchFolders()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFolder) {
        const { data, error } = await supabase
          .from("user_content")
          .select("*")
          .eq("folder_id", selectedFolder.id)
          .eq("user_id", userId)

        if (data) {
          setContentList(data)
        }
      } else {
        setContentList([])
      }
    }

    fetchData()
  }, [selectedFolder, userId, supabase])

  async function fetchFolders() {
    const { data, error } = await supabase
      .from("user_folders")
      .select("id, name")
      .eq("user_id", userId)

    if (data) {
      setFolders(data)
    } else if (error) {
      console.error("Error fetching folders:", error)
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

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder)
    if (isMobile) {
      closeMenu()
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
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
          contentList={contentList}
          setContentList={setContentList}
          userId={userId}
        />
      </div>
    </div>
  )
}
