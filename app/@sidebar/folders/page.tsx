import { FoldersList } from "@/app/home/Components/FolderList";
import { FoldersLoading } from "@/app/home/Components/LoadingComponents";
import { mockFolders } from "@/app/utils/mock-data";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Suspense } from "react";

export default function FoldersSidebar() {
  return (
    <SidebarWrapper>
      <Suspense fallback={<FoldersLoading />}>
        <FoldersList initialData={mockFolders.slice(0, 20)} />
      </Suspense>
    </SidebarWrapper>
  );
}
