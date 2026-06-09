

import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled
            ? "bg-black/50 backdrop-blur-xl border-white/10 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-serif font-bold text-xl rounded-sm">
              S
            </div>
            <span className="text-xl font-medium text-white tracking-tight font-sans">
              SkillBridge<span className="text-luxury-gold">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Masterclasses
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Membership
            </a>
            <div className="h-4 w-px bg-white/10" />
            <Link
              to="/login"
              className="text-sm font-medium text-white hover:text-luxury-gold transition-colors"
            >
              Log In
            </Link>
            <Link to="/signup">
              <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
                Start Legacy
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black z-40 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-serif text-white">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-luxury-gold"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
