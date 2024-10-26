import { Suspense, use } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Content, Folder } from "@/types/types"
import AddNewContent from "./AddNewContent"
import FolderActions from "./FolderActions"
import { ContentList } from "./ContentList"
import EmptyState from "./EmptyState"
import { ContentAreaSkeleton } from "@/components/ui/skeletons"
import { Input } from "../../components/ui/input"

interface ContentAreaProps {
  folderId: string | null
  selectedFolder: Folder | null
  contentList: Promise<Content[]>
  userId: string
}

export default function ContentArea({
  folderId,
  selectedFolder,
  contentList,
  userId,
}: ContentAreaProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto max-w-3xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {folderId && selectedFolder ? (
            <>
              <div className="sticky top-0 z-10 pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 sm:mb-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <h2 className="text-lg sm:text-2xl font-bold text-primary truncate max-w-[calc(100%-2rem)]">
                      {selectedFolder.name}
                    </h2>
                    <FolderActions
                      folderId={folderId}
                      folderName={selectedFolder.name}
                    />
                  </div>
                  <AddNewContent folderId={folderId}>
                    <Button
                      variant="default"
                      size="sm"
                      className="hover:bg-primary/90 w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Highlight
                    </Button>
                  </AddNewContent>
                </div>
              </div>
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search highlights..."
                        className="w-full px-4 py-2 rounded-md border border-input bg-muted/50"
                        disabled
                      />
                    </div>
                    <ContentAreaSkeleton />
                  </div>
                }
              >
                <ContentList
                  initialContent={use(contentList)}
                  folderId={folderId}
                  userId={userId}
                />
              </Suspense>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}
