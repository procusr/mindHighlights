"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Content } from "@/types/types";
import ContentCard from "./ContentCard";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { deleteContent, fetchContent } from "@/app/actions/contentActions";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      setIsLoading(true);
      try {
        const data = await fetchContent(
          folderId,
          userId,
          1,
          debouncedSearchTerm
        );
        if (isMounted) {
          setContent(data);
          setPage(1);
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // Reset content when folder changes or search term updates
    loadContent();

    return () => {
      isMounted = false;
    };
  }, [folderId, debouncedSearchTerm, userId]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        const nextPage = page + 1;
        const newData = await fetchContent(
          folderId,
          userId,
          nextPage,
          debouncedSearchTerm
        );
        setContent((prev) => [...prev, ...newData]);
        setPage(nextPage);
      } catch (error) {
        console.error("Error loading more content:", error);
      }
    });
  }, [folderId, userId, page, debouncedSearchTerm, isPending]);

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

  return (
    <div className="space-y-4 content-container">
      <div className="sticky top-10 z-20 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search highlights..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 rounded-md border border-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      ) : content.length > 0 ? (
        <div className="space-y-4">
          {content.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              folderId={folderId}
              onDelete={() => handleDelete(item.id)}
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

      {content.length >= 10 && (
        <Button onClick={handleLoadMore} disabled={isPending}>
          {isPending ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
};
