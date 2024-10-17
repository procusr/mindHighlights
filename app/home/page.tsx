import { redirect } from "next/navigation"
import UserContent from "./userContent"
import { createClient } from "@/utils/supabase/server"
import type { Folder } from "@/types/types"

async function fetchInitialData(userId: string): Promise<Folder[]> {
  const supabase = createClient()
  const { data: folders, error } = await supabase
    .from("user_folders")
    .select("id, name")
    .eq("user_id", userId)
  if (error) throw new Error(error.message)
  return folders || []
}

export default async function HomePage(
  props: {
    searchParams: Promise<{ folderId?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const supabase = createClient()

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

  const initialFolders = await fetchInitialData(user.id)
  const selectedFolderId = searchParams.folderId

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <UserContent
        userId={user.id}
        initialFolders={initialFolders}
        selectedFolderId={selectedFolderId}
      />
    </div>
  )
}
