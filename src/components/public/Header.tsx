import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Profile } from '../../types';

interface HeaderProps {
  profile: Profile;
}

export const Header: React.FC<HeaderProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Beranda', id: 'beranda' },
    { label: 'Keahlian', id: 'keahlian' },
    { label: 'Project', id: 'project' },
    { label: 'Pengalaman', id: 'pengalaman' },
    { label: 'Pelatihan', id: 'pelatihan' },
    { label: 'Bahasa', id: 'bahasa' },
    { label: 'Kontak', id: 'kontak' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo / Name */}
          <button
            onClick={() => scrollTo('beranda')}
            className="text-lg font-bold tracking-tight text-neutral-900 hover:text-blue-600 transition-colors"
          >
            {profile.name}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
