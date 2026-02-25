import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Clinics', href: '#clinics' },
  { label: 'Contact', href: '#follow' },
];

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl border-b shadow-lg'
          : 'bg-transparent'
      } ${
        scrolled
          ? isDark
            ? 'border-white/10 shadow-violet-900/20'
            : 'border-violet-200/40 shadow-violet-300/20'
          : ''
      }`}
      style={
        scrolled
          ? {
              background: isDark
                ? 'rgba(10, 5, 40, 0.85)'
                : 'rgba(245, 243, 255, 0.90)',
            }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cobalt-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-glow-purple">
              <span className="text-white font-serif font-bold text-sm">M</span>
            </div>
            <span className="font-serif font-semibold text-lg bg-gradient-to-r from-cobalt-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              MedPractice
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const sectionId = href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={href}
                  onClick={() => handleNavClick(href)}
                  className={`relative px-4 py-2 text-sm font-medium font-sans transition-all duration-200 rounded-lg group ${
                    isActive
                      ? 'text-fuchsia-500'
                      : isDark
                        ? 'text-white/70 hover:text-fuchsia-300'
                        : 'text-violet-800/80 hover:text-fuchsia-600'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-cobalt-400 to-fuchsia-400 rounded-full transition-all duration-200 ${
                      isActive ? 'w-4/5' : 'w-0 group-hover:w-3/5'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'text-white/70 hover:text-fuchsia-300 hover:bg-white/10'
                  : 'text-violet-700 hover:text-fuchsia-600 hover:bg-violet-100/60'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'text-white/70 hover:text-fuchsia-300 hover:bg-white/10'
                  : 'text-violet-700 hover:text-fuchsia-600 hover:bg-violet-100/60'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`md:hidden border-t ${isDark ? 'border-white/10' : 'border-violet-200/40'}`}
          style={{
            background: isDark
              ? 'rgba(10, 5, 40, 0.95)'
              : 'rgba(245, 243, 255, 0.97)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ label, href }) => {
              const sectionId = href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={href}
                  onClick={() => handleNavClick(href)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-sans transition-all duration-200 ${
                    isActive
                      ? isDark
                        ? 'text-fuchsia-400 bg-fuchsia-500/10'
                        : 'text-fuchsia-600 bg-fuchsia-100/60'
                      : isDark
                        ? 'text-white/70 hover:text-fuchsia-300 hover:bg-white/5'
                        : 'text-violet-800/80 hover:text-fuchsia-600 hover:bg-violet-100/40'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
