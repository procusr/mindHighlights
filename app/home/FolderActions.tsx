"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditFolderDialog from "@/components/EditFolderDialog";
import { deleteFolder, updateFolder } from "../actions/contentActions";
import type { Folder } from "@/types/types";

interface FolderActionsProps {
  folderId: string;
  folderName: string;
  onDeleted?: () => void;
  onEdited?: (folder: Folder) => void;
}

export default function FolderActions({
  folderId,
  folderName,
  onDeleted,
  onEdited,
}: FolderActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folderName);

  const handleDeleteFolder = async () => {
    await deleteFolder(folderId);
    setIsDeleteDialogOpen(false);
    onDeleted?.();
  };

  const handleEditFolder = async () => {
    if (newFolderName.trim() && newFolderName !== folderName) {
      const updatedFolder = await updateFolder(folderId, newFolderName);
      setIsEditDialogOpen(false);
      onEdited?.(updatedFolder);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="text"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-accent p-1"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Folder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirm Folder Deletion"
        description="Are you sure you want to delete this folder? This action cannot be undone and will delete all content within the folder."
        onConfirm={handleDeleteFolder}
      />

      <EditFolderDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onSave={handleEditFolder}
      />
    </>
  );
}
