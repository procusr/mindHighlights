import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import type { Content, Folder } from "@/types/types"
import Sidebar from "./Sidebar"
import { Suspense } from "react"
import { SidebarSkeleton, ContentAreaSkeleton } from "@/components/ui/skeletons"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import FolderActions from "./FolderActions"
import AddNewContent from "./AddNewContent"
import EmptyState from "./EmptyState"
import ContentList from "./ContentList"

async function fetchInitialData(userId: string): Promise<Folder[]> {
  const supabase = createClient()

  const { data: folders, error } = await supabase
    .from("user_folders")
    .select("id, name, user_id, created_at")
    .eq("user_id", userId)
  if (error) throw new Error(error.message)
  return folders as Folder[]
}

async function fetchContentForFolder(folderId: string): Promise<Content[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!folderId) return []

  const { data, error } = await supabase
    .from("user_content")
    .select("*")
    .eq("folder_id", folderId)
    .eq("user_id", user?.id)

  if (error) throw new Error(error.message)
  return data as Content[]
}

export default async function HomePage(props: {
  searchParams: Promise<{ folderId?: string }>
}) {
  const supabase = createClient()

  const folderId = (await props.searchParams)?.folderId ?? ""
  const contentListPromise = fetchContentForFolder(folderId)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  if (!user) {
    return redirect("/sign-in")
  }

  const initialFolders = (await fetchInitialData(user.id)) ?? []

  const selectedFolder =
    initialFolders.find((folder) => folder.id === folderId) || null

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex h-[calc(100vh-64px)] bg-gray-50">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar folderList={initialFolders} folderId={folderId} />
        </Suspense>
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
                    key={folderId}
                    fallback={
                      <div className="space-y-4">
                        <div className="relative">
                          <input
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
                      contentListPromise={contentListPromise}
                      folderId={folderId}
                    />
                  </Suspense>
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
