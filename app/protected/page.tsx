import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import UserContent from "./userContent"

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div>
        {/* <FetchDataSteps /> */}
        <UserContent userId={user.id} />
      </div>
    </div>
  )
}
