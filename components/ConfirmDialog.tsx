import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="p-4 rounded-2xl bg-card">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-primary">
          {title}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-gray-700">
        {description}
      </DialogDescription>
      <DialogFooter
        className={cn(
          "flex-col space-y-2 gap-4",
          "sm:justify-end sm:space-x-2"
        )}
      >
        <Button
          onClick={() => onOpenChange(false)}
          variant="ghost"
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="destructive"
          className="w-full sm:w-auto"
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default ConfirmDialog
