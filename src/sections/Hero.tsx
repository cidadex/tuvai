import React, { useEffect, useRef } from 'react';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onAgendarClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAgendarClick }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 500);
      const translateY = scrollY * 0.3;
      contentRef.current.style.opacity = String(opacity);
      contentRef.current.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMotoristaClick = () => {
    navigate('/cadastro-motorista');
  };

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-white"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FF6B00]/10 animate-float"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 text-[#FF6B00] px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
              <Star className="w-4 h-4 fill-current" />
              <span>Transporte de compras #1 do Brasil</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
                <span className="block animate-slide-up">Transporte de</span>
                <span className="block text-gradient animate-slide-up stagger-1">compras</span>
                <span className="block animate-slide-up stagger-2">sem cancelamento</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-lg text-[#666666] max-w-lg animate-slide-up stagger-3">
              Sabe quando o motorista cancela porque você tem muitas sacolas? 
              <span className="text-[#1A1A1A] font-semibold"> Isso não acontece aqui.</span>
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 animate-slide-up stagger-4">
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <Shield className="w-5 h-5 text-[#FF6B00]" />
                <span>Motoristas verificados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <Clock className="w-5 h-5 text-[#FF6B00]" />
                <span>Agendamento garantido</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-5">
              <button
                onClick={onAgendarClick}
                className="btn-primary flex items-center justify-center gap-2 group"
              >
                Agendar Meu Transporte
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleMotoristaClick}
                className="btn-secondary flex items-center justify-center"
              >
                Quero Ser Motorista
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 pt-4 animate-slide-up stagger-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {['M', 'J', 'A', 'C'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFB800] fill-current" />
                  ))}
                  <span className="text-sm font-semibold text-[#1A1A1A] ml-1">4.9/5</span>
                </div>
                <p className="text-xs text-[#666666]">Mais de 10.000 corridas realizadas</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-scale-in stagger-3">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/20 to-[#FF8C42]/10 rounded-3xl blur-3xl" />
            
            {/* Main Image Container */}
            <div className="relative w-full max-w-md lg:max-w-lg animate-float">
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Image */}
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop"
                  alt="Mulher feliz com sacolas de compras"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FF6B00] rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Corrida Confirmada</p>
                      <p className="text-sm text-[#666666]">Motorista a caminho • 3 min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-[#FF6B00] text-white px-4 py-2 rounded-full shadow-lg animate-pulse-glow">
                <span className="font-bold text-sm">R$20</span>
                <span className="text-xs opacity-90">/corrida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default Hero;
