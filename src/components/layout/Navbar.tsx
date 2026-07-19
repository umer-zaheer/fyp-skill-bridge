import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

const navLinks = [
  { label: "Courses", to: "/courses" as const },
  { label: "Masterclasses", to: "/courses" as const },
  { label: "Membership", to: "/signup" as const },
];

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
            ? "bg-white/80 dark:bg-black/50 backdrop-blur-xl border-zinc-200 dark:border-white/10 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-serif font-bold text-xl rounded-sm">
              S
            </div>
            <span className="text-xl font-medium text-zinc-900 dark:text-white tracking-tight font-sans">
              SkillBridge<span className="text-luxury-gold">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-4 w-px bg-zinc-200 dark:bg-white/10" />
            <ThemeToggle size="sm" />
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-900 hover:text-luxury-gold dark:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="keep-contrast bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Start Legacy
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle size="sm" />
            <button
              type="button"
              className="text-zinc-900 dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white dark:bg-black z-40 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-serif text-zinc-900 dark:text-white">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              ))}
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
