import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Gift, Coffee, Image } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { MediaItem } from '../types'
import MediaCard from '../components/MediaCard'
import LoadingSpinner from '../components/LoadingSpinner'

// Typewriter timing configuration (all in milliseconds)
const TYPING_SPEED = 4
const DELETING_SPEED = 1
const PAUSE_DURATION = 1000

const Home = () => {
  const [featured, setFeatured] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  const services = [
    { icon: <Sparkles size={40} />, title: 'Event Decorations', to: '/events', desc: 'Transform your space into a dream' },
    { icon: <Gift size={40} />, title: 'Gift Baskets & Packages', to: '/gifts', desc: 'Curated with love and luxury' },
    { icon: <Coffee size={40} />, title: 'Coffee Stands', to: '/coffee', desc: 'Brewing elegance at your spaces' },
    { icon: <Image size={40} />, title: 'Exotic Services', to: '/misc', desc: 'Unique experiences tailored for you' },
  ]

  // Phrases for the rotating typewriter (with exclamation)
  const phrases = [
    "Event Decorations!",
    "Bespoke Gift Packages!",
    "Elegant Coffee Stands!",
    "Extraordinary Experiences!"
  ]

  // Typewriter state
  const [displayedText, setDisplayedText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loop, setLoop] = useState(0)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayedText !== currentPhrase) {
      timeout = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1))
      }, TYPING_SPEED)
    } else if (isDeleting && displayedText !== '') {
      timeout = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1))
      }, DELETING_SPEED)
    } else if (!isDeleting && displayedText === currentPhrase) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, PAUSE_DURATION)
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
      setLoop(loop + 1)
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, phraseIndex, loop, phrases])

  // Fetch most recent 3 media items for featured section
  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      if (!error && data) {
        setFeatured(data)
      }
      setLoading(false)
    }

    fetchFeatured()
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Floating particles (stars/petals) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.8 + 0.8,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 40 + 40,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear",
              },
            }}
            style={{
              filter: 'blur(1px)',
            }}
          />
        ))}
        {/* Petal‑like shapes (slightly larger) */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute w-3 h-3 bg-gold/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: 360,
              transition: {
                duration: Math.random() * 40 + 40,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              },
            }}
            style={{
              filter: 'blur(2px)',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-20">
        {/* Hero with rotating typewriter */}
        <section className="text-center py-16 md:py-24">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="gold-gradient">Dream</span>
            <span className="text-white">box</span>
            <span className="gold-gradient"> 11.11</span>
          </motion.h1>

          <div className="max-w-3xl mx-auto min-h-[120px] px-4">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              <span className="text-white">We craft unforgettable moments through exquisite </span>
              <span className="text-gold font-semibold inline-block min-w-[200px] text-left">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </p>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link to="/events" className="px-8 py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold-light transition shadow-lg shadow-gold/30">
              Explore Our Work
            </Link>
            <Link to="/contact" className="px-8 py-3 border border-gold text-gold rounded-full hover:bg-gold/10 transition">
              Get in Touch
            </Link>
          </motion.div>
        </section>

        {/* Services / Pitches */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-6 text-center rounded-xl group cursor-pointer border border-gold/20"
            >
              <Link to={service.to}>
                <div className="text-gold mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold gold-gradient mb-2">{service.title}</h3>
                <p className="text-sm text-gray-400">{service.desc}</p>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Featured Work – now from Supabase */}
        <section className="py-12">
          <h2 className="text-3xl md:text-4xl gold-gradient text-center mb-10">Recent Magic</h2>
          
          {loading ? (
            <LoadingSpinner />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featured.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No recent items yet. Check back soon!</p>
          )}
        </section>

        {/* About Teaser */}
        <section className="glass-card p-8 rounded-xl text-center max-w-3xl mx-auto border border-gold/20">
          <h2 className="text-3xl gold-gradient mb-4">Behind the Dream</h2>
          <p className="text-gray-300 mb-6">
            Dreambox 11.11 was founded by <span className="text-gold font-semibold">Halima Mukhtar Gashash</span>, a visionary event designer with a passion for turning the ordinary into the extraordinary. With over a decade of experience, Halima leads a team dedicated to making every celebration unique.
          </p>
          <Link to="/about" className="text-gold hover:underline">Read full story →</Link>
        </section>
      </div>
    </div>
  )
}

export default Home
