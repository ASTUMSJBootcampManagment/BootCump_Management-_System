import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import logo from "../assets/astumsj-logo.png"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="absolute left-0 right-0 top-0 z-50">

      <nav className="mx-auto max-w-7xl px-5 py-5 lg:px-8">

        <div className="flex items-center justify-between rounded-2xl bg-[#062B67] px-5 py-3 shadow-xl">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">

            <img
              src={logo}
              alt="ASTUMSJ Bootcamp"
              className="h-11 w-11 object-contain"
            />

            <div>
              <p className="font-bold leading-none text-white">
                ASTUMSJ
              </p>

              <p className="mt-1 text-[10px] font-bold tracking-[0.18em] text-emerald-400">
                BOOTCAMP
              </p>
            </div>

          </Link>


          {/* for broad view */}
          <div className="hidden items-center gap-8 lg:flex">

            <a
              href="#home"
              className="text-sm font-medium text-white/90 transition hover:text-emerald-400"
            >
              Home
            </a>

            <a
              href="#tracks"
              className="text-sm font-medium text-white/90 transition hover:text-emerald-400"
            >
              Tracks
            </a>

            <a
              href="#program"
              className="text-sm font-medium text-white/90 transition hover:text-emerald-400"
            >
              Program
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-white/90 transition hover:text-emerald-400"
            >
              About
            </a>

            <a
              href="#faq"
              className="text-sm font-medium text-white/90 transition hover:text-emerald-400"
            >
              FAQ
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-white/90 transition hover:text-emerald-400"
            >
              Contact
            </a>

          </div>


          <div className="hidden items-center gap-3 lg:flex">

            <Link
              to="/login"
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-[#062B67] transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              Get Started
            </Link>

          </div>


          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-white lg:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>

      {/* mobile view */}
        
        {menuOpen && (
          <div className="mt-2 rounded-2xl bg-[#062B67] p-5 lg:hidden">

            <div className="flex flex-col gap-4">

              <a href="#home" className="text-white">
                Home
              </a>

              <a href="#tracks" className="text-white">
                Tracks
              </a>

              <a href="#program" className="text-white">
                Program
              </a>

              <a href="#about" className="text-white">
                About
              </a>

              <a href="#faq" className="text-white">
                FAQ
              </a>

              <Link
                to="/login"
                className="rounded-lg bg-white px-5 py-2.5 text-center font-bold text-[#062B67]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-center font-bold text-white"
              >
                Get Started
              </Link>

            </div>

          </div>
        )}

      </nav>

    </header>
  )
}

export default Navbar