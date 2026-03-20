import type { MediaItem } from '../types'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  item: MediaItem
}

const MediaCard = ({ item }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="glass-card rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-gold/20 transition-all duration-500"
    >
      <div className="relative aspect-video bg-black/40 flex items-center justify-center">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.title}
            className={`w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <video
            src={item.url}
            controls
            className="w-full h-full object-contain"
            poster={item.thumbnail || undefined}
          />
        )}
        {!isLoaded && item.type === 'image' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold gold-gradient">{item.title}</h3>
        {item.description && <p className="text-sm text-gray-300 mt-1">{item.description}</p>}
      </div>
    </motion.div>
  )
}

export default MediaCard
