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
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold">Scrollable Content</h2>
      <div className="relative  overflow-y-auto overflow-x-hidden">
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          condimentum, nisl nec ultrices ultricies, nunc libero aliquet nunc,
          quis ultricies nunc nunc nec nunc. Nullam nec nunc nec nunc nunc nunc.
          Nullam nec nunc nec nunc nunc nunc. Nullam nec nunc nec nunc
        </p>
      </div>
    </div>
  );
}
