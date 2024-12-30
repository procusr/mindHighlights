import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Content, Folder } from "@/types/types";
import Sidebar from "./Sidebar";
import { Suspense } from "react";
import {
  SidebarSkeleton,
  ContentAreaSkeleton,
} from "@/components/ui/skeletons";
import EmptyState from "./EmptyState";
import { Input } from "../../components/ui/input";
import SelectedFolderView from "./SelectedFolderView";

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

  const selectedFolder =
    initialFolders.find((folder) => folder.id === folderId) || null;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex h-[calc(100vh-64px)] bg-gray-50">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar folderList={initialFolders} folderId={folderId} />
        </Suspense>

        <div className="flex-1">
          {/* <InstallPrompt /> */}
          {folderId && selectedFolder ? (
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="relative max-w-3xl">
                    <Input
                      type="search"
                      placeholder="Search highlights..."
                      className="w-full px-4 py-2 rounded-md border border-input bg-muted/50"
                      disabled
                    />
                  </div>
                  <ContentAreaSkeleton />
                </div>
              }
            >
              <SelectedFolderView
                folderId={folderId}
                initialContent={initialContent}
                selectedFolder={selectedFolder}
                user={user}
              />
            </Suspense>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
