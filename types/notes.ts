export interface Note {
  id: string
  title: string
  content: string
  category: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  backgroundColor: string
}