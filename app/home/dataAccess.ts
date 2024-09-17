import { createClient } from "@/utils/supabase/client"

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
}
