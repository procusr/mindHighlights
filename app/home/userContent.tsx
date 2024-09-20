"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "../../utils/supabase/client"
import { useSidebar } from "../contexts/SidebarContext"
import type { Content, Folder } from "../../types/types"
import Sidebar from "./Sidebar"
import ContentArea from "./ContentArea"
import { fetchContentList } from "./dataAccess"

export default function UserContent({ userId }: { userId: string }) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [contentList, setContentList] = useState<Content[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const { menuOpen, closeMenu } = useSidebar()
  const supabase = createClient()

  useEffect(() => {
    fetchFolders()
  }, [])

  useEffect(() => {
    if (selectedFolder) {
      fetchContentList(selectedFolder.id, userId, setContentList)
    }
  }, [selectedFolder, userId])

  async function fetchFolders() {
    const { data, error } = await supabase
      .from("user_folders")
      .select("id, name")
      .eq("user_id", userId)

    if (data) {
      setFolders(data)
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
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 relative">
      <Sidebar
        folders={folders}
        setFolders={setFolders}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        userId={userId}
        menuOpen={menuOpen}
      />
      <ContentArea
        selectedFolder={selectedFolder}
        contentList={contentList}
        setContentList={setContentList}
        userId={userId}
      />
    </div>
  )
}
