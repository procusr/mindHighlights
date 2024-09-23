import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newFolderName: string
  setNewFolderName: (name: string) => void
  onSave: () => void
}

const EditFolderDialog: React.FC<EditFolderDialogProps> = ({
  open,
  onOpenChange,
  newFolderName,
  setNewFolderName,
  onSave,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Folder Name</DialogTitle>
      </DialogHeader>
      <Input
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="New folder name"
      />
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)} variant="outline">
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default EditFolderDialog
