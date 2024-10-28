import { Plus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddNewFolder from "./AddNewFolder"
import KindleImport from "./KindleImport"

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
      <p className="text-center text-muted-foreground mb-4 px-4">
        Select a folder to view your highlights or create a new one
      </p>
      <AddNewFolder>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create New Folder
        </Button>
      </AddNewFolder>
      <KindleImport>
        <Button variant="secondary">
          <BookOpen className="h-4 w-4 mr-2" />
          Import from Kindle
        </Button>
      </KindleImport>
    </div>
  )
}
