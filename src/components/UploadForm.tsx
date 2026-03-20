import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { MediaCategory } from '../types'

const categories: MediaCategory[] = ['events', 'gifts', 'coffee', 'misc']

const UploadForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<MediaCategory>('events')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) return

    setUploading(true)
    setMessage('')

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = `${category}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(category) // bucket name = category
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from(category)
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      // 3. Determine media type
      const type = file.type.startsWith('image/') ? 'image' : 'video'

      // 4. Insert metadata into media table
      const { error: dbError } = await supabase
        .from('media')
        .insert({
          title,
          description,
          category,
          type,
          url: publicUrl,
          thumbnail: null, // could generate thumbnail for videos later
        })

      if (dbError) throw dbError

      setMessage('Upload successful!')
      setTitle('')
      setDescription('')
      setFile(null)
      // Reset file input
      const fileInput = document.getElementById('file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto glass-card p-6 rounded-xl space-y-4">
      <h2 className="text-2xl gold-gradient mb-4">Upload New Content</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MediaCategory)}
          className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">File (Image or Video)</label>
        <input
          id="file"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          required
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-light"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-light transition disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p className={`text-center ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}
    </form>
  )
}

export default UploadForm
