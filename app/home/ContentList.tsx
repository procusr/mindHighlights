"use client"

import { useState, useEffect, useTransition, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { Content } from "@/types/types"
import ContentCard from "./ContentCard"
import { Search } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useDebounce } from "../../hooks/useDebounce"
import { Input } from "../../components/ui/input"
import { deleteContent } from "../actions/contentActions"

interface ContentListProps {
  initialContent: Content[]
  folderId: string
  userId: string
}

export const ContentList: React.FC<ContentListProps> = ({
  initialContent,
  folderId,
  userId,
}) => {
  const [content, setContent] = useState<Content[]>(initialContent)
  const [isLoading, startTransition] = useTransition()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const router = useRouter()
  const supabase = createClient()

  const loadContent = async (searchTerm = "", page = 1) => {
    startTransition(async () => {
      const pageSize = 15
      let query = supabase
        .from("user_content")
        .select("*")
        .eq("folder_id", folderId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
        )
      }

      const { data, error } = await query

      if (!error && data) {
        setContent(
          page === 1 ? data : (prevContent) => [...prevContent, ...data]
        )
        setPage(page)
      }
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const handleDelete = async (contentId: string) => {
    try {
      // Optimistically update UI
      setContent((prevContent) =>
        prevContent.filter((item) => item.id !== contentId)
      )

      await deleteContent(contentId, folderId)
      router.refresh()
    } catch (error) {
      console.error("Error in deletion process:", error)
      loadContent(debouncedSearchTerm, page)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadContent(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  return (
    <div className="space-y-4  content-container">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search highlights..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4  rounded-md border border-input mt-1"
        />
      </div>

      {content.length > 0 ? (
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
        <Button
          onClick={() => loadContent(debouncedSearchTerm, page + 1)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  )
}
