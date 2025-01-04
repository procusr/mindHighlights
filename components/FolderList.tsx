// components/folders/folders-list.tsx
"use client";

import { useInView } from "react-intersection-observer";
import { FolderItem } from "@/app/home/Components/FolderItem";
import { useEffect } from "react";
import { useFolderStates } from "@/hooks/useFolderState";

const ITEMS_PER_PAGE = 20;

export function FoldersList() {
  const [{ search, sort, page }, setFolderStates] = useFolderStates();
  const { ref, inView } = useInView();

  // Simulate folder data with pagination
  const folders = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
    id: `folder-${(page - 1) * ITEMS_PER_PAGE + i}`,
    name: `Folder ${(page - 1) * ITEMS_PER_PAGE + i}`,
  }));

  // Load more when scrolling
  useEffect(() => {
    if (inView) {
      setFolderStates({ page: page + 1 });
    }
  }, [inView]);

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="p-4 border-b">
        <input
          type="text"
          value={search}
          onChange={(e) => setFolderStates({ search: e.target.value })}
          placeholder="Search folders..."
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Sort control */}
      <div className="px-4">
        <select
          value={sort}
          onChange={(e) => setFolderStates({ sort: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="name">Name</option>
          <option value="date">Date</option>
        </select>
      </div>

      {/* Folders list */}
      <div className="divide-y">
        {folders.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    </div>
  );
}
