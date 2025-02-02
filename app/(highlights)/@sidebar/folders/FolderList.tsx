"use client";

import { Input } from "@/components/ui/input";
import { FolderItem } from "./FolderItem";
import type { Folder } from "@/types/types";
import { useState, useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";

interface FoldersListProps {
  folderList: Folder[];
  totalCount: number;
  currentPage: number;
}

export function FoldersList({
  folderList,
  totalCount,
  currentPage,
}: FoldersListProps) {
  const [folderListState, setFolderListState] = useState<Folder[]>(folderList);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const router = useRouter();

  const [inputValue, setInputValue] = useQueryState(
    "query",
    parseAsString
      .withOptions({
        shallow: true,
        throttleMs: 300,
        history: "replace",
      })
      .withDefault("")
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setFolderListState(folderList);
  }, [inputValue, folderList]);

  useEffect(() => {
    setFolderListState(
      folderList.filter((folder) =>
        folder.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [folderList, inputValue]);

  // TODO: Make this proper when we get more folders
  useEffect(() => {
    if (inView && folderListState.length < totalCount) {
      const nextPage = currentPage + 1;
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("page", nextPage.toString());

      if (inputValue) {
        searchParams.set("query", inputValue);
      }

      router.push(`?${searchParams.toString()}`, { scroll: false });
    }
  }, [
    inView,
    currentPage,
    totalCount,
    folderListState.length,
    router,
    inputValue,
  ]);

  return (
    <section className="flex flex-col gap-2.5 px-2.5">
      <div className="sticky top-0 backdrop-blur-sm pt-1 z-10">
        <Input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search folders..."
          aria-label="Search folders"
        />

        <div className="mt-1 border-t border-gray-100" />
      </div>

      <ul className="space-y-1.5 overflow-y-auto h-[calc(100dvh-112px)] pr-1.5 scroll-smooth">
        {folderListState.map((folder) => (
          <FolderItem folder={folder} key={folder.id} />
        ))}

        {folderListState.length < totalCount && (
          <div ref={ref} className="h-14 flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
          </div>
        )}

        {!folderListState.length && (
          <div className="text-center text-gray-400 py-8">
            No folders found{inputValue && ` for "${inputValue}"`}
          </div>
        )}
      </ul>
    </section>
  );
}
