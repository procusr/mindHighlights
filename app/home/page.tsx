import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Content, Folder } from "@/types/types";
import UserContent from "./UserContent";
import InstallPrompt from "../components/InstallPrompt";

async function fetchUserFolders(userId: string): Promise<Folder[]> {
  const supabase = createClient();

  const { data: folders, error } = await supabase
    .from("user_folders")
    .select("id, name, user_id, created_at")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return folders as Folder[];
}

async function fetchContentForFolder(
  folderId: string,
  userId: string
): Promise<Content[]> {
  const supabase = createClient();

  if (!folderId) return [];

  const { data, error } = await supabase
    .from("user_content")
    .select("*")
    .eq("folder_id", folderId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data as Content[];
}

export default async function HomePage(props: {
  searchParams: Promise<{ folderId?: string }>;
}) {
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

  const folderId = (await props.searchParams)?.folderId ?? "";
  const [initialFolders, initialContent] = await Promise.all([
    fetchUserFolders(user.id),
    fetchContentForFolder(folderId, user.id),
  ]);

  return (
    <>
      <UserContent
        folderId={folderId}
        initialFolders={initialFolders}
        initialContent={initialContent}
        user={user}
      />
      <InstallPrompt />
    </>
  );
}
