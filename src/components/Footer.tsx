import { Instagram, Phone, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-card border-t border-gold/20 py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Social & Contact Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          <a
            href="https://instagram.com/dreambox_11.11"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <Instagram size={20} />
            <span>@dreambox1111</span>
          </a>
          <a
            href="tel:+2348000000000"
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <Phone size={20} />
            <span>+234 800 000 0000</span>
          </a>
          <a
            href="mailto:dreambox@gmail.com"
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            <Mail size={20} />
            <span>dreanbox@gmail.com</span>
          </a>
        </div>

        {/* Copyright and Designer Credit */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>© {new Date().getFullYear()} Dreambox 11.11. All rights reserved.</p>
          <p>
            Designed by{' '}
            <a
              href="https://sizesnigeria.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              www.sizesnigeria.vercel.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
