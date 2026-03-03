import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onLoginClick: () => void;
  onAgendarClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onAgendarClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isCliente, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Preços', href: '#precos' },
    { label: 'Motoristas', href: '#motoristas' },
    { label: 'FAQ', href: '#faq' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#inicio');
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
                TU VAI
              </span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`text-sm font-medium transition-all hover:text-[#FF6B00] relative group ${
                    isScrolled ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B00] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {isCliente && (
                    <button
                      onClick={onAgendarClick}
                      className="btn-primary text-sm"
                    >
                      Agendar Agora
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-[#666666] hover:text-[#1A1A1A] transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="text-sm font-medium text-[#1A1A1A] hover:text-[#FF6B00] transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={onAgendarClick}
                    className="btn-primary text-sm"
                  >
                    Agendar Agora
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#1A1A1A]" />
              ) : (
                <Menu className="w-6 h-6 text-[#1A1A1A]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-24 px-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-lg font-medium text-[#1A1A1A] py-3 border-b border-gray-100 hover:text-[#FF6B00] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                {isCliente && (
                  <button
                    onClick={() => {
                      onAgendarClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-primary w-full"
                  >
                    Agendar Agora
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center font-medium text-[#666666]"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center font-medium text-[#1A1A1A] border border-gray-200 rounded-full"
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    onAgendarClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full"
                >
                  Agendar Agora
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
