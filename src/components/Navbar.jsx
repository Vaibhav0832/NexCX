import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Insights", href: "#insights" },
  { label: "Why NexCX", href: "#why" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/85 backdrop-blur-md border-b border-white/8 shadow-glass" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo-wordmark.png"
            alt="NexCX"
            className="h-9 w-auto select-none"
            draggable="false"
          />
        </a>

        <ul className="hidden lg:flex items-center gap-9 font-medium text-sm text-slate-soft">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-ice transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a href="#contact" className="btn-secondary !py-2.5 !px-5 text-sm">
            Contact Us
          </a>
          <a href="#contact" className="btn-primary !py-2.5 !px-5 text-sm">
            Book Discovery Call
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-ice"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-navy/95 backdrop-blur-md border-t border-white/8 px-6 py-6"
        >
          <ul className="flex flex-col gap-5 text-slate-soft font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block hover:text-ice transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-6">
            <a href="#contact" onClick={() => setOpen(false)} className="btn-secondary w-full">
              Contact Us
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-full">
              Book Discovery Call
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
