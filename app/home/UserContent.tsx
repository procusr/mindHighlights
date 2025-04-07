"use client";

import type { Content, Folder } from "@/types/types";
import SelectedFolderView from "./SelectedFolderView";
import type { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

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
      <div className="flex-1">
        <SelectedFolderView
          folderId={folderId}
          initialContent={initialContent}
          selectedFolder={selectedFolder}
          user={user}
        />
      </div>
    </div>
  );
}
