import { FOLDER_SEARCH_LIMIT } from "@/app/constants/constants";
import { FoldersList } from "@/app/(highlights)/@sidebar/folders/FolderList";
import { FoldersLoading } from "@/app/home/Components/LoadingComponents";
import SidebarWrapper from "@/components/SidebarWrapper";
import type { Folder } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { fetchUserFolders } from "@/app/actions/contentActions";

interface SearchParams {
  query?: string | null;
  page?: string;
}

export default async function FoldersSidebar({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
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
