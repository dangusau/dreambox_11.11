export type MediaCategory = 'events' | 'gifts' | 'coffee' | 'misc'
export type MediaType = 'image' | 'video'

export interface MediaItem {
  id: number
  created_at: string
  title: string
  description: string | null
  category: MediaCategory
  type: MediaType
  url: string
  thumbnail: string | null
}
