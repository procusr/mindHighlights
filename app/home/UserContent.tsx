"use client";

import type { Content, Folder } from "@/types/types";
import SelectedFolderView from "./SelectedFolderView";
import Sidebar from "./Sidebar";
import type { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function UserContent({
  initialFolders,
  folderId,
  initialContent,
  user,
}: {
  initialFolders: Folder[];
  folderId: string;
  initialContent: Content[];
  user: User;
}) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  const selectedFolder = folders.find(
    (folder) => folder.id === folderId
  ) as Folder;

  return (
    <div className="flex w-full">
      <Sidebar
        folderList={folders}
        folderId={folderId}
        onCreate={(newFolder) => setFolders((prev) => [...prev, newFolder])}
      />

      <div className="flex-1">
        <SelectedFolderView
          folderId={folderId}
          initialContent={initialContent}
          selectedFolder={selectedFolder}
          user={user}
          onDeleteFolder={() =>
            setFolders((prev) => prev.filter((f) => f.id !== folderId))
          }
          onEditFolder={(folder) =>
            setFolders((prev) =>
              prev.map((f) => (f.id === folder.id ? folder : f))
            )
          }
        />
      </div>
    </div>
  );
}
