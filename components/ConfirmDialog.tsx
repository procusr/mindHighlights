import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px] bg-background border-border">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-foreground">
          {title}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-muted-foreground">
        {description}
      </DialogDescription>
      <DialogFooter
        className={cn(
          "flex flex-col gap-2",
          "sm:flex-row sm:justify-end sm:gap-2"
        )}
      >
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          className="w-full sm:w-auto hover:bg-secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="alert"
          className="w-full sm:w-auto hover:bg-destructive/90"
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmDialog;
