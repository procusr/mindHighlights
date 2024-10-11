import { redirect } from "next/navigation"
import UserContent from "./userContent"
import { createClient } from "@/utils/supabase/server"

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  const { data: folders } = await supabase
    .from("user_folders")
    .select("id, name")
    .eq("user_id", user.id)

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <UserContent userId={user.id} initialFolders={folders || []} />
    </div>
  )
}
