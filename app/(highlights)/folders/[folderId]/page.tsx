import type { Content, Folder } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

import { notFound, redirect } from "next/navigation";
import SelectedFolderView from "@/app/home/SelectedFolderView";
import { fetchUserFolders } from "@/app/actions/contentActions";

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

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;

  if (!folderId) {
    notFound();
  }

  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const [initialFolders, initialContent] = await Promise.all([
    fetchUserFolders({ userId: user.id }),
    fetchContentForFolder(folderId, user.id),
  ]);

  const selectedFolder = initialFolders.folders.find(
    (folder: Folder) => folder.id === folderId
  ) as Folder;

  return (
    <SelectedFolderView
      initialContent={initialContent}
      selectedFolder={selectedFolder}
      user={user}
    />
  );
}
