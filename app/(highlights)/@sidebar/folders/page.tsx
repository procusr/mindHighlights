import { FOLDER_SEARCH_LIMIT } from "@/app/constants/constants";
import { FoldersList } from "@/app/(highlights)/@sidebar/folders/FolderList";
import { FoldersLoading } from "@/app/home/Components/LoadingComponents";
import SidebarWrapper from "@/components/SidebarWrapper";
import type { Folder } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface SearchParams {
  query?: string | null;
  page?: string;
}

async function fetchUserFolders({
  userId,
  query,
  page,
}: {
  userId: string;
  query?: string | null;
  page?: string;
}): Promise<{
  folders: Folder[];
  count: number;
}> {
  const supabase = createClient();
  const pageInt = Number(page || "1");

  let foldersQuery = supabase
    .from("user_folders")
    .select("id, name, user_id, created_at", { count: "exact" })
    .eq("user_id", userId)
    .range(0, pageInt * FOLDER_SEARCH_LIMIT - 1);

  if (query && query.trim() !== "") {
    foldersQuery = foldersQuery.ilike("name", `%${query}%`);
  }

  const { data, error, count } = await foldersQuery;
  if (error) throw new Error(error.message);

  return {
    folders: data as Folder[],
    count: count || 0,
  };
}

export default async function FoldersSidebar({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();
  const { query, page = "1" } = await searchParams;

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

  const { folders, count } = await fetchUserFolders({
    userId: user.id,
    query,
    page,
  });

  return (
    <SidebarWrapper>
      <Suspense fallback={<FoldersLoading />}>
        <FoldersList
          folderList={folders}
          totalCount={count}
          currentPage={Number(page)}
        />
      </Suspense>
    </SidebarWrapper>
  );
}
