export interface Folder {
  id: string
  name: string
}

export interface Content {
  id: string
  folder_id: string
  content: string
  title: string
  anchor: string | null
  user_id: string
}
