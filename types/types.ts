export interface Folder {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Content {
  id: string;
  user_id: string;
  content: string | null;
  title: string | null;
  anchor: string | null;
  created_at: string;
  folder_id: string;
}
