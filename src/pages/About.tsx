import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl gold-gradient mb-6">About Dreambox 11.11</h1>
        <p className="text-xl text-gray-300">
          Where creativity meets style. We transform spaces, craft memories, and brew experiences.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 rounded-xl"
      >
        <h2 className="text-3xl gold-gradient mb-4">Our Story</h2>
        <p className="text-gray-300 leading-relaxed">
          Founded in 2018, Dreambox 11.11 began as a small passion project at home. Today, we are a full‑service event design company trusted by top brands and private clients alike. Our name reflects our belief that every event should feel like a dream — and the numbers 11.11 symbolize alignment and magic moments.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center"
      >
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gold shadow-xl shadow-gold/30">
          <img src="https://via.placeholder.com/300?text=CEO" alt="HMG" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-3xl gold-gradient mb-2">Halima Mukhtar Gashash</h2>
          <p className="text-gold mb-4">Founder & CEO</p>
          <p className="text-gray-300 leading-relaxed">
            With a decade of experience in event planning, Halima brings a unique vision to every project. Their philosophy: "Every detail matters, and every moment can be magical." Under Halima's leadership, Dreambox 11.11 has won multiple industry awards and, more importantly, the hearts of countless clients.
          </p>
        </div>
      </motion.section>
    </div>
  )
}

export default About
