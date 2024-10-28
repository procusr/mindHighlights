"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { KindleBook } from "@/types/kindle"
import { useToast } from "@/hooks/use-toast"

interface KindleImportProps {
  children: React.ReactNode
}

export default function KindleImport({ children }: KindleImportProps) {
  const [open, setOpen] = useState(false)
  const [books, setBooks] = useState<KindleBook[]>([])
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchBooks = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching books...")

      const response = await fetch("/api/kindle/books")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch books")
      }

      console.log("Books received:", data.books)
      setBooks(data.books)

      toast({
        title: "Success!",
        description: `Found ${data.books.length} books with highlights`,
      })
    } catch (error) {
      console.error("Error fetching books:", error)
      toast({
        variant: "destructive",
        title: "Error fetching books",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKindleAuth = async () => {
    try {
      setIsLoading(true)
      await fetchBooks()
    } catch (error) {
      console.error("Error in Kindle auth:", error)
      toast({
        variant: "destructive",
        title: "Error connecting to Kindle",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSelection = (bookId: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    )
  }

  const handleImportHighlights = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/kindle/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookIds: selectedBooks }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast({
        title: "Success!",
        description: `Imported highlights from ${selectedBooks.length} books`,
      })
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error importing highlights",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Kindle Highlights</DialogTitle>
            <DialogDescription>
              Select the books you want to import highlights from
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {books.length === 0 ? (
              <>
                <div className="text-sm text-muted-foreground">
                  <div>
                    Before importing, please ensure:
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      <li>
                        You have a Kindle device or app synced with Amazon
                      </li>
                      <li>Your highlights are synced to your Amazon account</li>
                      <li>You're logged into your Amazon account</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={handleKindleAuth}
                  className="w-full"
                  disabled={isLoading}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isLoading ? "Connecting..." : "Connect to Kindle"}
                </Button>
              </>
            ) : (
              <>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    {books.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center space-x-4"
                      >
                        <Checkbox
                          id={book.id}
                          checked={selectedBooks.includes(book.id)}
                          onCheckedChange={() => handleBookSelection(book.id)}
                        />
                        <label
                          htmlFor={book.id}
                          className="flex-1 text-sm cursor-pointer"
                        >
                          <p className="font-medium">{book.title}</p>
                          <p className="text-muted-foreground">
                            {book.author} • {book.highlightCount} highlights
                          </p>
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  onClick={handleImportHighlights}
                  className="w-full"
                  disabled={selectedBooks.length === 0 || isLoading}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isLoading
                    ? "Importing..."
                    : `Import Highlights (${selectedBooks.length} books)`}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
