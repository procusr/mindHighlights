export interface Folder {
  id: string
  name: string
}

export interface Content {
  id: string
  title: string
  content: string
  folder_id: string
  user_id: string
}
