"use client";

import { useState, useTransition } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { addNewContent } from "../actions/contentActions";
import type { Content } from "@/types/types";

interface AddNewContentProps {
  children: ReactNode;
  folderId: string;
  onAddContent: (content: Content) => void;
}

export default function AddNewContent({
  children,
  folderId,
  onAddContent,
}: AddNewContentProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitionPending, startTransition] = useTransition();
  const [autoTitle, setAutoTitle] = useState(true);

  const handleAddContent = () => {
    if (!content.trim() || isTransitionPending) return;
    if (!autoTitle && !title.trim()) return;

    startTransition(async () => {
      try {
        const contentToAdd = await addNewContent(
          content,
          folderId,
          autoTitle ? undefined : title
        );
        onAddContent(contentToAdd);
        setContent("");
        setTitle("");
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to add content:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Add New Highlight</DialogTitle>
        <DialogDescription>
          Enter the content you want to highlight.
        </DialogDescription>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="auto-title"
              className="text-sm text-muted-foreground"
            >
              Generate title in a form of question
            </Label>
            <Switch
              id="auto-title"
              checked={autoTitle}
              onCheckedChange={setAutoTitle}
              disabled={isTransitionPending}
            />
          </div>

          {!autoTitle && (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title manually"
              disabled={isTransitionPending}
            />
          )}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here..."
            className="min-h-[100px]"
            disabled={isTransitionPending}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddContent}
            disabled={
              isTransitionPending ||
              !content.trim() ||
              (!autoTitle && !title.trim())
            }
            className="relative min-w-[100px]"
          >
            {isTransitionPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Add Content"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
