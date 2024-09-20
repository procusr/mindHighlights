import { createClient } from "@/utils/supabase/client"
import type { Content } from "@/types/types"

const supabase = createClient()

export async function fetchFolders({
  fn,
  userId,
}: {
  fn: () => void
  userId: string
}) {
  const { data, error } = await supabase
    .from("user_folders")
    .select("id, name")
    .eq("user_id", userId)

  if (data) {
    fn()
  }
  if (error) {
    console.error(error)
  }
}

export async function deleteFolder(folderId: string, fn: () => void) {
  const { error } = await supabase
    .from("user_folders")
    .delete()
    .eq("id", folderId)

  if (!error) {
    fn()
  }
}

export async function fetchContentList(
  folderId: string,
  userId: string,
  fn: (data: Content[]) => void
) {
  try {
    const { data, error } = await supabase
      .from("user_content")
      .select("id, content, folder_id")
      .eq("user_id", userId)
      .eq("folder_id", folderId)
      .order("created_at", { ascending: false })

    if (error) throw error
    fn(data)
  } catch (error) {
    console.error("Error fetching content:", error)
  }
}
