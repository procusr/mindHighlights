export interface KindleBook {
  id: string
  title: string
  author: string
  highlightCount: number
  lastHighlightDate: string
  asin?: string
}

export interface KindleHighlight {
  id: string
  text: string
  location: string
  page?: string
  bookId: string
  createdAt: string
  note?: string
}
