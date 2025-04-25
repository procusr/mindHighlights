"use client";

import { useCallback, useEffect, useState } from "react";
import AddNewContent from "./AddNewContent";
import FolderActions from "./FolderActions";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Content, Folder } from "@/types/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { deleteContent, fetchContent } from "../actions/contentActions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import ContentCard from "./ContentCard";
import { Skeleton } from "@/components/ui/skeleton";

import { Finder } from "@/components/Search";

const ITEMS_PER_PAGE = 10;

export default function SelectedFolderView({
  selectedFolder,
  initialContent,
  user,
}: {
  selectedFolder: Folder;
  initialContent: Content[];
  user: { id: string };
}) {
  const [content, setContent] = useState<Content[]>(initialContent);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  initialContent;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNewContent = (newContent: Content) => {
    setContent((prev) => [newContent, ...prev]);
  };

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      setIsLoading(true);
      try {
        const data = await fetchContent(
          selectedFolder.id,
          user.id,
          currentPage,
          debouncedSearchTerm,
          ITEMS_PER_PAGE
        );
        if (isMounted) {
          setContent(data.items);
          setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadContent();
    return () => {
      isMounted = false;
    };
  }, [selectedFolder.id, debouncedSearchTerm, user.id, currentPage]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDelete = useCallback(
    async (contentId: string) => {
      try {
        setContent((prev) => prev.filter((item) => item.id !== contentId));
        await deleteContent(contentId, selectedFolder.id);
        router.refresh();
      } catch (error) {
        console.error("Error in deletion process:", error);
      }
    },
    [selectedFolder.id, router]
  );

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="1">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis and surrounding pages
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const foldername =
    selectedFolder?.name.length > 30
      ? `${selectedFolder?.name.slice(0, 22)}...`
      : selectedFolder?.name;

  return (
    <>
      <div className="flex sticky top-0 z-30 max-w-2xl px-6 py-3  justify-between items-center bg-background/95">
        <div className="flex items-center">
          <h2 className="text-lg font-bold ">{foldername}</h2>
          <FolderActions
            key={selectedFolder.id}
            folderId={selectedFolder.id}
            folderName={selectedFolder?.name}
          />
        </div>
        <Finder
          handleSearch={handleSearch}
          inputValue={searchTerm}
          clearInput={() => setSearchTerm("")}
        />
        <AddNewContent
          folderId={selectedFolder.id}
          onAddContent={handleNewContent}
        >
          <Button
            variant="text"
            size="sm"
            className="hover:bg-primary hover:text-primary-foreground transition-colors rounded-md"
          >
            <Plus className="h-4 w-4 sm:mr-2 mr-0" />
            <span className="hidden sm:block">Add highlight</span>
          </Button>
        </AddNewContent>
      </div>
      <div className="space-y-2 h-screen max-w-2xl ">
        {isLoading ? (
          <div className="space-y-4 px-4 sm:px-6">
            {[...Array(3)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Skeleton key={i} className="h-[100px] w-full " />
            ))}
          </div>
        ) : content?.length > 0 ? (
          <div className="pb-32 space-y-4 px-4 sm:px-6">
            {content.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                folderId={selectedFolder.id}
                onDelete={() => handleDelete(item.id)}
                onUpdate={(updated) => {
                  setContent((prev) =>
                    prev.map((c) => (c.id === updated.id ? updated : c))
                  );
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No highlights found matching your search"
                : "No highlights yet. Add your first highlight!"}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="fixed bottom-[15px] bg-background/95 backdrop-blur-sm sm:px-4 max-w-2xl w-full pb-2">
          <hr className="pt-2" />
          <Pagination>
            <PaginationContent className="gap-1">
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
