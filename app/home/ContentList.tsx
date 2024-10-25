"use client"

import { type Usable, use, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MoreVertical, Edit, Delete, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Content } from "@/types/types"
import {
  deleteContent,
  generateMemoryAnchor,
  updateContentAnchor,
} from "../actions/contentActions"
import EditContentDialog from "./EditContentDialog"

interface ContentListProps {
  contentList: Usable<Content[]>
  folderId: string
}

export default function ContentList({
  contentList,
  folderId,
}: ContentListProps) {
  const fetchedContent = use(contentList)

  const [expandedContentId, setExpandedContentId] = useState<string | null>(
    null
  )
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [generatingMemoryId, setGeneratingMemoryId] = useState<string | null>(
    null
  )

  const handleToggleContent = (contentId: string) =>
    setExpandedContentId((prev) => (prev === contentId ? null : contentId))

  const handleDeleteContent = async (contentId: string) => {
    await deleteContent(contentId, folderId)
  }

  const handleMemory = async (id: string, content: string) => {
    if (!content.trim()) return
    setGeneratingMemoryId(id)
    try {
      const anchor = await generateMemoryAnchor(content)
      await updateContentAnchor(id, anchor, folderId)
    } finally {
      setGeneratingMemoryId(null)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {fetchedContent.map((content) => (
        <motion.div
          key={content.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer"
            onClick={() => handleToggleContent(content.id)}
          >
            <CardHeader className="p-4 bg-gradient-to-r from-secondary/30 to-primary/10 relative">
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-sm font-medium break-words mr-2 flex-grow">
                  {content.title}
                </CardTitle>
                <ContentActions
                  content={content}
                  onEdit={() => setEditingContent(content)}
                  onDelete={() => handleDeleteContent(content.id)}
                />
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedContentId === content.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-4 bg-gradient-to-b from-transparent to-secondary/10">
                    <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap mb-4">
                      <span className="bg-highlight">{content.content}</span>
                    </p>
                    <MemorySection
                      content={content}
                      onMemory={() => handleMemory(content.id, content.content)}
                      isGenerating={generatingMemoryId === content.id}
                    />
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      ))}
      <EditContentDialog
        content={editingContent}
        isOpen={!!editingContent}
        onClose={() => setEditingContent(null)}
        folderId={folderId}
      />
    </div>
  )
}

interface ContentActionsProps {
  content: Content
  onEdit: () => void
  onDelete: () => Promise<void>
}

function ContentActions({ onEdit, onDelete }: ContentActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Edit className="h-4 w-4 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Delete className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MemorySection({
  content,
  onMemory,
  isGenerating,
}: {
  content: Content
  onMemory: () => void
  isGenerating: boolean
}) {
  return content.anchor ? (
    <div className="mt-4 p-3 bg-primary/5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text-sm italic text-muted-foreground flex-grow mr-2">
          {content.anchor}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onMemory()
          }}
          disabled={isGenerating}
          className="flex-shrink-0"
        >
          <RefreshCw className="size-3" />
        </Button>
      </div>
    </div>
  ) : (
    <Button
      variant="ghost"
      size="sm"
      className="inline-flex justify-between gap-2"
      onClick={(e) => {
        e.stopPropagation()
        onMemory()
      }}
    >
      Help me remember
      <Sparkles className="size-3" />
    </Button>
  )
}
