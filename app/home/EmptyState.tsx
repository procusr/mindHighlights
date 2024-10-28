import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddNewFolder from "./AddNewFolder";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <p className="text-center text-muted-foreground mb-4 px-4">
        Select a folder to view your highlights or create a new one
      </p>
      <AddNewFolder>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create New Folder
        </Button>
      </AddNewFolder>
    </div>
  );
}
