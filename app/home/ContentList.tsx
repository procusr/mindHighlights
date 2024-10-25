"use client"

import { use, useOptimistic, useState, useDeferredValue } from "react"
import type { Content } from "@/types/types"
import ContentCard from "./ContentCard"
import { Search } from "lucide-react"

interface ContentListProps {
  contentList: Promise<Content[]>
  folderId: string
}

export default function ContentList({
  contentList,
  folderId,
}: ContentListProps) {
  const contents = use(contentList)
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const [optimisticContents] = useOptimistic<Content[]>(contents)

  const filteredContent = optimisticContents.filter(
    (content) =>
      content.title.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(deferredSearchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search highlights..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-input"
        />
      </div>

      {filteredContent.length > 0 ? (
        <div className="space-y-4">
          {filteredContent.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              folderId={folderId}
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
  )
}
