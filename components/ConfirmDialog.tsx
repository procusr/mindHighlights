import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  isMobile?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isMobile,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className={isMobile ? "sm:max-w-[425px] p-4" : "sm:max-w-[425px] p-6"}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogDescription>{description}</DialogDescription>
      <DialogFooter
        className={
          isMobile ? "flex-col space-y-2" : "sm:justify-end sm:space-x-2"
        }
      >
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
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
