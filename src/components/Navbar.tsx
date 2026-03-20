import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/gifts', label: 'Gifts' },
    { to: '/coffee', label: 'Coffee' },
    { to: '/misc', label: 'Misc' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-gold/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold gold-gradient animate-pulse-slow">
          DREAMBOX 11.11
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-gold transition-colors ${location.pathname === link.to ? 'text-gold border-b border-gold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-gold" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-card border-t border-gold/20"
        >
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-3 hover:bg-gold/10"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
