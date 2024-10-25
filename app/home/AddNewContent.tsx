"use client"
import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

import Markdown from "react-markdown"
import { Switch } from "@/components/ui/switch"
import { Label } from "../../components/ui/label"
import { addNewContent } from "../actions/contentActions"

interface AddNewContentProps {
  folderId: string
  children: ReactNode
}

const AddNewContent: React.FC<AddNewContentProps> = ({
  folderId,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [showInput, setShowInput] = useState(true)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex-col justify-between gap-2">
            <DialogTitle>Add New Content</DialogTitle>
            <div className="flex items-center space-x-2">
              <Label className="text-xs">
                Generate Title in a form of question
              </Label>
              <Switch
                checked={showInput}
                onClick={() => setShowInput((prev) => !prev)}
              />
            </div>
          </DialogHeader>
          {!showInput && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your title here..."
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          )}
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              className="min-h-[200px] "
            />
            <Markdown>{content}</Markdown>
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setIsLoading(true)
                await addNewContent(content, folderId, title)
                setIsLoading(false)
                setIsOpen(false)
                setContent("")
                setTitle("")
              }}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddNewContent
