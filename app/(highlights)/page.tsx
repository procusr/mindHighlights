import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>Select a menu item to get started.</p>
    </div>
  );
}
