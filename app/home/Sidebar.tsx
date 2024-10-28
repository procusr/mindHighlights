"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import type { Folder } from "../../types/types";
import AddNewFolder from "./AddNewFolder";
import FolderList from "../../components/FolderList";
import { Button } from "@/components/ui/button";
import { Plus, Search, X, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "../contexts/SidebarContext";

interface SidebarProps {
  folderList: Folder[];
  folderId: string;
}

export default function Sidebar({ folderList, folderId }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { closeMenu, menuOpen } = useSidebar();

  const filteredFolders = folderList.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMenu]);

  return (
    <aside
      className={`${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      } sidebar fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-background to-background/95 transition-all duration-300 ease-in-out md:static md:translate-x-0 border-r border-border flex flex-col shadow-lg`}
      aria-labelledby="sidebar-heading"
    >
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="sidebar-heading"
            className="text-xl font-bold text-primary flex items-center"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Collections
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={closeMenu}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="folder-search-input"
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-background border-input focus:ring-1 focus:ring-ring"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="px-4 py-6">
          <FolderList folders={filteredFolders} folderId={folderId} />
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border">
        <AddNewFolder>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Folder
          </Button>
        </AddNewFolder>
      </div>
    </aside>
  );
}
