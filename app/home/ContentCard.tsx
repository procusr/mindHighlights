"use client"

import { useState } from "react"
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

interface ContentCardProps {
  content: Content
  folderId: string
}

export default function ContentCard({ content, folderId }: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isGeneratingMemory, setIsGeneratingMemory] = useState(false)

  const handleDelete = async () => {
    await deleteContent(content.id, folderId)
  }

  const handleMemory = async () => {
    if (!content.content.trim()) return
    setIsGeneratingMemory(true)
    try {
      const anchor = await generateMemoryAnchor(content.content)
      await updateContentAnchor(content.id, anchor, folderId)
    } finally {
      setIsGeneratingMemory(false)
    }
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="p-4 bg-gradient-to-r from-secondary/30 to-primary/10">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-sm font-medium break-words mr-2 flex-grow">
            {content.title}
          </CardTitle>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary p-1">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Delete className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-4 bg-gradient-to-b from-transparent to-secondary/10">
          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap mb-4">
            <span className="bg-highlight">{content.content}</span>
          </p>
          {content.anchor ? (
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
                    handleMemory()
                  }}
                  disabled={isGeneratingMemory}
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
                handleMemory()
              }}
              disabled={isGeneratingMemory}
            >
              Help me remember
              <Sparkles className="size-3" />
            </Button>
          )}
        </CardContent>
      )}
      <EditContentDialog
        content={content}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        folderId={folderId}
      />
    </Card>
  )
}
