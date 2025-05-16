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
    <div className="p-4">
      <h2 className="text-xl font-bold">Scrollable Content</h2>
      <div className="relative overflow-y-auto overflow-x-hidden">
        <p className="text-sm">Home page of the highlight section</p>
      </div>
    </div>
  );
}
