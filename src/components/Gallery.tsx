import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { MediaItem, MediaCategory } from '../types'
import MediaCard from './MediaCard'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  category: MediaCategory
}

const Gallery = ({ category }: Props) => {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching media:', error)
      } else {
        setItems(data || [])
      }
      setLoading(false)
    }

    fetchMedia()
  }, [category])

  if (loading) return <LoadingSpinner />

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No content yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {items.map(item => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Gallery
