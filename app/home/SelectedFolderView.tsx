"use client";

import React, { useEffect, useState } from "react";
import AddNewContent from "./AddNewContent";
import FolderActions from "./FolderActions";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentList } from "./ContentList";
import type { Content } from "@/types/types";

export default function SelectedFolderView({
  folderId,
  selectedFolder,
  initialContent,
  user,
}: {
  folderId: string;
  selectedFolder: { name: string };
  initialContent: Content[];
  user: { id: string };
}) {
  const [content, setContent] = useState<Content[]>(initialContent);

  const handleNewContent = (newContent: Content) => {
    setContent((prev) => [newContent, ...prev]);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="sticky top-0 z-30 bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <h2 className="text-lg sm:text-2xl font-bold text-primary truncate max-w-[calc(100%-2rem)]">
                {selectedFolder.name}
              </h2>
              <FolderActions
                key={folderId}
                folderId={folderId}
                folderName={selectedFolder.name}
              />
            </div>
            <AddNewContent folderId={folderId} onAddContent={handleNewContent}>
              <Button
                variant="default"
                size="sm"
                className="hover:bg-primary/90 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Highlight
              </Button>
            </AddNewContent>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 overflow-y-auto">
        <ContentList
          initialContent={content}
          folderId={folderId}
          userId={user.id}
        />
      </div>
    </div>
  );
}
