import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageCircle, Shield, Check, Headphones } from 'lucide-react';

interface FinalCTAProps {
  onAgendarClick: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onAgendarClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const trustBadges = [
    { icon: Shield, text: 'Pagamento seguro' },
    { icon: Check, text: 'Motoristas verificados' },
    { icon: Headphones, text: 'Suporte 24h' },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/95 via-[#1A1A1A]/85 to-[#1A1A1A]/70" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FF6B00]/20 animate-float"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Pronto para nunca mais{' '}
            <span className="text-gradient">se preocupar?</span>
          </h2>

          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Agende agora e tenha tranquilidade na sua próxima compra.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onAgendarClick}
              className="bg-[#FF6B00] text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#FF8C42] transition-all transform hover:scale-105 animate-pulse-glow"
            >
              Agendar Meu Transporte
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/30"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Trust Badges */}
          <div className={`flex flex-wrap justify-center gap-6 pt-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-white/80">
                <badge.icon className="w-5 h-5 text-[#FF6B00]" />
                <span className="text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
