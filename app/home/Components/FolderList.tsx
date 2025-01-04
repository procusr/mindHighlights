// components/folders/folders-list.tsx
"use client";

import { mockFolders } from "@/app/utils/mock-data";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FolderItem } from "./FolderItem";

export function FoldersList({ initialData }: { initialData: any[] }) {
  const [folders, setFolders] = useState(initialData);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      const nextFolders = mockFolders.slice(page * 20, (page + 1) * 20);

      if (nextFolders.length > 0) {
        setFolders((prev) => [...prev, ...nextFolders]);
        setPage((p) => p + 1);
      }
    }
  }, [inView, page]);

  return (
    <div className="overflow-y-auto">
      {folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}

      <div ref={ref} className="h-8">
        {folders.length < mockFolders.length && <p>Loading...</p>}
      </div>
    </div>
  );
}
