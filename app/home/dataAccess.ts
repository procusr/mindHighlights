import { createClient } from "@/utils/supabase/client";
import type { Content } from "@/types/types";

const supabase = createClient();

export async function deleteFolder(folderId: string, fn: () => void) {
  const { error } = await supabase
    .from("user_folders")
    .delete()
    .eq("id", folderId);

  if (!error) {
    fn();
  }
}
