"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Content } from "@/types/types";
import ContentCard from "./ContentCard";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { deleteContent, fetchContent } from "@/app/actions/contentActions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";

const ITEMS_PER_PAGE = 10;

interface ContentListProps {
  initialContent: Content[];
  folderId: string;
  userId: string;
}

export const ContentList: React.FC<ContentListProps> = ({
  initialContent,
  folderId,
  userId,
}) => {
  const [content, setContent] = useState<Content[]>(initialContent);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      setIsLoading(true);
      try {
        const data = await fetchContent(
          folderId,
          userId,
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
  }, [folderId, debouncedSearchTerm, userId, currentPage]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of content area smoothly
    document.querySelector(".content-container")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleDelete = useCallback(
    async (contentId: string) => {
      try {
        setContent((prev) => prev.filter((item) => item.id !== contentId));
        await deleteContent(contentId, folderId);
        router.refresh();
      } catch (error) {
        console.error("Error in deletion process:", error);
      }
    },
    [folderId, router]
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

  return (
    <div className="w-full flex flex-col relative">
      <div className="sticky top-0 z-30 pb-2 bg-gray-50">
        <div className="relative mx-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4  text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search highlights..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 rounded-md border border-input"
          />
        </div>
      </div>
      <ScrollArea className="space-y-4 w-full px-4 sm:px-6 h-screen">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Skeleton key={i} className="h-[100px] w-full" />
            ))}
          </div>
        ) : content.length > 0 ? (
          <div className="sm:pb-36 pb-44 space-y-4">
            {content.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                folderId={folderId}
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
      </ScrollArea>
      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-2 sm:px-4 w-full">
          <Pagination>
            <PaginationContent className="gap-1">
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
