// app/folders/[folderId]/page.tsx
import { FolderItemContent } from "@/app/home/Components/FolderItemContent";
import { mockFolders } from "@/app/utils/mock-data";
import { notFound } from "next/navigation";

export default function FolderPage({
  params: { folderId },
}: {
  params: { folderId: string };
}) {
  const folder = mockFolders.find((f) => f.id === folderId);

  if (!folder) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{folder.name}</h1>
      <p className="text-muted-foreground mt-4">
        Contains {folder.items.length} items.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {folder.items.map((item) => (
          <FolderItemContent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
