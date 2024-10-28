import { useState } from "react";
import { addNewContent } from "@/app/actions/contentActions";
import type { Content } from "@/types/types";

interface AddContentFormProps {
  userId: string;
  folderId: string;
  onContentAdded: (newContent: Content) => void;
}

export default function AddContentForm({
  userId,
  folderId,
  onContentAdded,
}: AddContentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newContent = await addNewContent(content, folderId, userId);
    onContentAdded(newContent);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter new content"
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Content
      </button>
    </form>
  );
}
