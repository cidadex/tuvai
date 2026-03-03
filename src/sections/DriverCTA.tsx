import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, DollarSign, Calendar, Clock, Shield, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DriverCTA: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ motoristas: 0, renda: 0, avaliacao: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counters
          const duration = 2000;
          const steps = 60;
          const interval = duration / steps;
          
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            setCounters({
              motoristas: Math.floor(500 * easeOut),
              renda: Math.floor(3000 * easeOut),
              avaliacao: Math.floor(49 * easeOut) / 10,
            });
            
            if (step >= steps) clearInterval(timer);
          }, interval);
          
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

  const handleMotoristaClick = () => {
    navigate('/cadastro-motorista');
  };

  const benefits = [
    { icon: Calendar, text: 'Corridas garantidas, sem cancelamento' },
    { icon: DollarSign, text: 'Pagamento semanal' },
    { icon: Clock, text: 'Horário flexível' },
    { icon: Shield, text: 'Suporte 24h' },
  ];

  const stats = [
    { value: `${counters.motoristas}+`, label: 'motoristas ativos', icon: Users },
    { value: `R$ ${counters.renda.toLocaleString()}+`, label: 'renda média', icon: TrendingUp },
    { value: `${counters.avaliacao.toFixed(1)}★`, label: 'avaliação do app', icon: Shield },
  ];

  return (
    <section id="motoristas" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
                Seja motorista <span className="text-gradient">TU VAI</span>
              </h2>
              <p className="text-lg text-[#666666]">
                Ganhe mais com corridas garantidas. Nossos motoristas faturam em média{' '}
                <span className="text-[#FF6B00] font-semibold">30% a mais</span> que em outros apps.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-[#F5F5F5] rounded-2xl p-4 text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="w-6 h-6 text-[#FF6B00] mx-auto mb-2" />
                  <p className="text-xl font-bold text-[#1A1A1A]">{stat.value}</p>
                  <p className="text-xs text-[#666666]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <span className="text-[#1A1A1A]">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleMotoristaClick}
              className="btn-primary flex items-center gap-2 group text-lg px-8 py-4"
            >
              Quero Ser Motorista
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Image */}
          <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="relative">
              {/* Background Shape */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#FF6B00]/10 to-[#FF8C42]/5 rounded-3xl transform rotate-3" />
              
              {/* Main Image */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=1000&fit=crop"
                  alt="Motorista feliz"
                  className="w-full h-auto object-cover"
                />
                
                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A1A]">R$ 3.240,00</p>
                      <p className="text-sm text-[#666666]">Ganhos este mês</p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                        +30%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-[#FF6B00] text-white px-4 py-2 rounded-full shadow-lg animate-pulse-glow">
                <span className="font-bold">30%</span>
                <span className="text-sm"> a mais</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriverCTA;
