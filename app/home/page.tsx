import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import type { Content, Folder } from "@/types/types"
import Sidebar from "./Sidebar"
import ContentArea from "./ContentArea"

async function fetchInitialData(userId: string): Promise<Folder[]> {
  const supabase = createClient()
  const { data: folders, error } = await supabase
    .from("user_folders")
    .select("id, name")
    .eq("user_id", userId)
  if (error) throw new Error(error.message)
  return folders || []
}

async function fetchContentForFolder(folderId: string): Promise<Content[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("user_content")
    .select("*")
    .eq("folder_id", folderId)
    .eq("user_id", user?.id)

  if (error) throw new Error(error.message)
  return data as Content[]
}

export default async function HomePage(props: {
  searchParams: Promise<{ folderId?: string }>
}) {
  const supabase = createClient()

  const folderId = (await props.searchParams)?.folderId ?? ""

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  if (!user) {
    return redirect("/sign-in")
  }

  const initialFolders = (await fetchInitialData(user.id)) ?? []

  const selectedFolder =
    initialFolders.find((folder: Folder) => folder.id === folderId) ||
    initialFolders[0]

  const contentList = fetchContentForFolder(folderId)

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex h-[calc(100vh-64px)] bg-gray-50">
        <Sidebar folderList={initialFolders} folderId={folderId} />
        <ContentArea
          folderId={folderId}
          selectedFolder={selectedFolder}
          fetchContentList={contentList}
          setFolders={() => {}}
          setSelectedFolder={() => {}}
        />
      </div>
    </div>
  )
}
