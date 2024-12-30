"use client";

import React, { useState } from "react";
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

  const foldername =
    selectedFolder?.name.length > 30
      ? `${selectedFolder.name.slice(0, 22)}...`
      : selectedFolder.name;

  return (
    <div className="flex flex-col h-screen rounded-md">
      <div className="sticky top-0 z-30 max-w-3xl px-6 py-2 flex justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-bold text-primary max-w-[calc(100%-1rem)]">
            {foldername}
          </h2>
          <FolderActions
            key={folderId}
            folderId={folderId}
            folderName={selectedFolder.name}
          />
        </div>
        <AddNewContent folderId={folderId} onAddContent={handleNewContent}>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="h-4 w-4 sm:mr-2 mr-0" />
            <span className="hidden sm:block">Add highlight</span>
          </Button>
        </AddNewContent>
      </div>
      <ContentList
        initialContent={content}
        folderId={folderId}
        userId={user.id}
      />
    </div>
  );
}
