import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import Gifts from './pages/Gifts'
import Coffee from './pages/Coffee'
import Misc from './pages/Misc'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black text-white relative">
        {/* Grain overlay */}
        <div className="fixed inset-0 bg-grain pointer-events-none opacity-20 z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/coffee" element={<Coffee />} />
              <Route path="/misc" element={<Misc />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
