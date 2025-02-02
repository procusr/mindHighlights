"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import type { Folder } from "../../types/types";
import AddNewFolder from "../(highlights)/@sidebar/folders/AddNewFolder";
import { Button } from "@/components/ui/button";
import { Plus, Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

interface SidebarProps {
  folderList: Folder[];
  folderId: string;
  onCreate: (newFolder: Folder) => void;
}

export default function Sidebar({
  folderList,
  folderId,
  onCreate,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFolders = folderList.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth >= 768) {
  //       closeMenu();
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [closeMenu]);

  return (
    <>
      <aside
        className={cn(
          "-translate-x-full",
          "sidebar fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-background to-background/95 transition-all duration-300 ease-in-out md:static md:translate-x-0 border-r border-border flex flex-col shadow-lg pb-12"
        )}
        aria-labelledby="sidebar-heading"
      >
        <div className="sticky sm:top-0  bg-background/80 backdrop-blur-sm z-10 p-4 border-b border-border">
          <div className="flex justify-between items-center mb-2">
            <h2
              id="sidebar-heading"
              className="text-xl font-bold text-primary flex items-center"
            >
              Folders
            </h2>
            <AddNewFolder onFolderCreated={onCreate}>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <Plus className="size-4 mr-1" />
                New Folder
              </Button>
            </AddNewFolder>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="folder-search-input"
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-background border-input focus:ring-1 focus:ring-ring"
              // onClick={openMenu}
            />
            {searchTerm && (
              <Button
                variant="text"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setSearchTerm("");
                  // openMenu();
                }}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {/* <ScrollArea className="flex-grow px-4 py-6 sm:pb-10 pb-20 ">
          <FolderList folders={filteredFolders} folderId={folderId} />
        </ScrollArea> */}
      </aside>
    </>
  );
}
