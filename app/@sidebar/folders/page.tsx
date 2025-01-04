import { FoldersList } from "@/app/home/Components/FolderList";
import { FoldersLoading } from "@/app/home/Components/LoadingComponents";
import { mockFolders } from "@/app/utils/mock-data";
import { Suspense } from "react";

export default function FoldersSidebar() {
  return (
    <div className="h-full">
      <Suspense fallback={<FoldersLoading />}>
        <FoldersList initialData={mockFolders.slice(0, 20)} />
      </Suspense>
    </div>
  );
}
