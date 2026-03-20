import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import type { MediaItem, MediaCategory } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, X, Upload, MessageSquare, Mail, Phone, User, CheckCircle, Circle } from 'lucide-react'

// ---------- Notification Component ----------
interface Notification {
  id: string
  message: string
  type: 'success' | 'error'
}

const Notification = ({ notification, onClose }: { notification: Notification; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${
        notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' : 'bg-red-900/90 border-red-500 text-red-100'
      }`}
    >
      {notification.message}
    </motion.div>
  )
}

// ---------- Edit Modal ----------
interface EditModalProps {
  item: MediaItem | null
  onClose: () => void
  onSave: (id: number, updates: Partial<MediaItem>) => Promise<void>
  categories: MediaCategory[]
}

const EditModal = ({ item, onClose, onSave, categories }: EditModalProps) => {
  const [title, setTitle] = useState(item?.title || '')
  const [description, setDescription] = useState(item?.description || '')
  const [category, setCategory] = useState<MediaCategory>(item?.category || 'events')
  const [saving, setSaving] = useState(false)

  if (!item) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave(item.id, { title, description, category })
    setSaving(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card max-w-md w-full p-6 rounded-xl border border-gold/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl gold-gradient">Edit Media</h2>
          <button onClick={onClose} className="text-gold hover:text-gold-light">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold-light transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gold text-gold rounded-lg hover:bg-gold/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ---------- Delete Confirmation Modal ----------
interface DeleteModalProps {
  item: MediaItem | null
  onClose: () => void
  onConfirm: (id: number) => Promise<void>
}

const DeleteModal = ({ item, onClose, onConfirm }: DeleteModalProps) => {
  const [deleting, setDeleting] = useState(false)

  if (!item) return null

  const handleDelete = async () => {
    setDeleting(true)
    await onConfirm(item.id)
    setDeleting(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="glass-card max-w-md w-full p-6 rounded-xl border border-gold/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl gold-gradient mb-4">Confirm Delete</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="text-gold font-semibold">"{item.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gold text-gold rounded-lg hover:bg-gold/10"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ---------- Upload Form ----------
interface UploadFormProps {
  onUploadSuccess: () => void
  setNotification: (message: string, type: 'success' | 'error') => void
}

const UploadForm = ({ onUploadSuccess, setNotification }: UploadFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<MediaCategory>('events')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const categories: MediaCategory[] = ['events', 'gifts', 'coffee', 'misc']

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) {
      setNotification('Please provide a title and select a file.', 'error')
      return
    }

    setUploading(true)

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = `${category}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(category)
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
          thumbnail: null,
        })

      if (dbError) throw dbError

      setNotification('Upload successful!', 'success')
      setTitle('')
      setDescription('')
      setFile(null)
      const fileInput = document.getElementById('file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      onUploadSuccess()
    } catch (err: any) {
      setNotification(`Upload failed: ${err.message}`, 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-4">
      <h2 className="text-2xl gold-gradient mb-4 flex items-center gap-2">
        <Upload size={24} /> Upload New Content
      </h2>

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
    </form>
  )
}

// ---------- Messages List Component ----------
interface Contact {
  id: number
  created_at: string
  name: string
  phone: string
  email: string
  message: string
  status: 'unread' | 'read'
}

const MessagesList = ({ setNotification }: { setNotification: (message: string, type: 'success' | 'error') => void }) => {
  const [messages, setMessages] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMessages(data)
    } else {
      console.error('Error fetching messages:', error)
    }
    setLoading(false)
  }

  const markAsRead = async (id: number) => {
    const { error } = await supabase
      .from('contacts')
      .update({ status: 'read' })
      .eq('id', id)

    if (error) {
      setNotification('Failed to update status', 'error')
    } else {
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, status: 'read' } : m))
      )
      setNotification('Message marked as read', 'success')
    }
  }

  const markAsUnread = async (id: number) => {
    const { error } = await supabase
      .from('contacts')
      .update({ status: 'unread' })
      .eq('id', id)

    if (error) {
      setNotification('Failed to update status', 'error')
    } else {
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, status: 'unread' } : m))
      )
      setNotification('Message marked as unread', 'success')
    }
  }

  const deleteMessage = async (id: number) => {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      setNotification('Failed to delete message', 'error')
    } else {
      setMessages(prev => prev.filter(m => m.id !== id))
      setNotification('Message deleted', 'success')
    }
  }

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true
    return m.status === filter
  })

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl gold-gradient mb-4 flex items-center gap-2">
        <MessageSquare size={24} /> Contact Messages
      </h2>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-gold/20 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-t-lg transition ${filter === 'all' ? 'bg-gold/20 text-gold border-b-2 border-gold' : 'text-gray-400 hover:text-gold'}`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-t-lg transition ${filter === 'unread' ? 'bg-gold/20 text-gold border-b-2 border-gold' : 'text-gray-400 hover:text-gold'}`}
        >
          Unread ({messages.filter(m => m.status === 'unread').length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-3 py-1 rounded-t-lg transition ${filter === 'read' ? 'bg-gold/20 text-gold border-b-2 border-gold' : 'text-gray-400 hover:text-gold'}`}
        >
          Read ({messages.filter(m => m.status === 'read').length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No messages found.</p>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredMessages.map(msg => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg border ${msg.status === 'unread' ? 'border-gold/40 bg-gold/5' : 'border-gold/10 bg-black/30'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {msg.status === 'unread' ? (
                    <Circle size={16} className="text-gold fill-gold/30" />
                  ) : (
                    <CheckCircle size={16} className="text-gray-500" />
                  )}
                  <span className="text-gold font-semibold">{msg.name}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-300 mb-3">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gold" />
                  {msg.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gold" />
                  {msg.email}
                </div>
              </div>

              <p className="text-gray-200 bg-black/30 p-3 rounded border border-gold/10 mb-3">
                {msg.message}
              </p>

              <div className="flex gap-2 justify-end">
                {msg.status === 'unread' ? (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="px-3 py-1 text-xs bg-gold/20 text-gold rounded hover:bg-gold/30 transition"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <button
                    onClick={() => markAsUnread(msg.id)}
                    className="px-3 py-1 text-xs border border-gold/30 text-gold rounded hover:bg-gold/10 transition"
                  >
                    Mark as Unread
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- Main Admin Component ----------
const Admin = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'media' | 'messages'>('media')

  // Media management state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>('all')
  const [fetching, setFetching] = useState(true)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null)

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([])

  const categories: MediaCategory[] = ['events', 'gifts', 'coffee', 'misc']

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const fetchMedia = async () => {
    setFetching(true)
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMediaItems(data)
    }
    setFetching(false)
  }

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(mediaItems)
    } else {
      setFilteredItems(mediaItems.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, mediaItems])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchMedia()
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchMedia()
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMediaItems([])
  }

  const handleEdit = async (id: number, updates: Partial<MediaItem>) => {
    const { error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)

    if (error) {
      addNotification(`Update failed: ${error.message}`, 'error')
    } else {
      addNotification('Media updated successfully!', 'success')
      fetchMedia()
    }
  }

  const handleDelete = async (id: number) => {
    const item = mediaItems.find(i => i.id === id)
    if (!item) return

    const fileName = item.url.split('/').pop()
    if (fileName) {
      await supabase.storage
        .from(item.category)
        .remove([`${item.category}/${fileName}`])
    }

    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (error) {
      addNotification(`Delete failed: ${error.message}`, 'error')
    } else {
      addNotification('Media deleted successfully!', 'success')
      fetchMedia()
    }
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-20 glass-card p-8 rounded-xl">
        <h1 className="text-3xl gold-gradient mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-white"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-light transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AnimatePresence>
        {notifications.map(n => (
          <Notification key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {editingItem && (
          <EditModal
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleEdit}
            categories={categories}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingItem && (
          <DeleteModal
            item={deletingItem}
            onClose={() => setDeletingItem(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl gold-gradient">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold/10"
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gold/20">
        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'media' ? 'text-gold border-b-2 border-gold' : 'text-gray-400 hover:text-gold'}`}
        >
          Media Management
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'messages' ? 'text-gold border-b-2 border-gold' : 'text-gray-400 hover:text-gold'}`}
        >
          Contact Messages
        </button>
      </div>

      {activeTab === 'media' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <UploadForm onUploadSuccess={fetchMedia} setNotification={addNotification} />
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-2xl gold-gradient mb-4 flex items-center gap-2">
              <Pencil size={24} /> Manage Media
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MediaCategory | 'all')}
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            {fetching ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No media items found.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gold/10 hover:border-gold/30 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gold font-semibold truncate">{item.title}</h3>
                      <p className="text-xs text-gray-400">
                        {item.category} • {item.type} • {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gold hover:text-gold-light transition"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-2 text-red-400 hover:text-red-300 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <MessagesList setNotification={addNotification} />
      )}
    </div>
  )
}

export default Admin
