import React, { useEffect, useRef, useState } from 'react';
import { Calendar, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks: React.FC = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: '01',
      icon: Calendar,
      title: 'Agende seu horário',
      description: 'Escolha o mercado, seu endereço e o melhor horário. Tudo pelo app, em menos de 2 minutos.',
      color: 'from-[#FF6B00] to-[#FF8C42]',
    },
    {
      number: '02',
      icon: CreditCard,
      title: 'Pague a reserva de R$10',
      description: 'Essa reserva garante seu motorista e será descontada do valor total da corrida.',
      color: 'from-[#FF8C42] to-[#FFB800]',
    },
    {
      number: '03',
      icon: CheckCircle,
      title: 'Transporte garantido',
      description: 'Seu motorista chega no horário combinado, ajuda com as compras e te leva em segurança.',
      color: 'from-[#22C55E] to-[#16A34A]',
    },
  ];

  return (
    <section id="como-funciona" ref={sectionRef} className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            3 passos simples para nunca mais se preocupar
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {/* Step Number */}
              <div className={`absolute -top-4 -left-2 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                <span className="text-white font-bold text-xl">{step.number}</span>
              </div>

              {/* Icon */}
              <div className="mt-8 mb-6">
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-2xl flex items-center justify-center group-hover:bg-[#FF6B00]/10 transition-colors">
                  <step.icon className="w-8 h-8 text-[#FF6B00]" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{step.title}</h3>
              <p className="text-[#666666] leading-relaxed">{step.description}</p>

              {/* Arrow (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className={`mt-16 max-w-2xl mx-auto transition-all duration-700 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FF6B00] via-[#FF8C42] to-[#22C55E] rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="flex justify-between mt-3 text-sm text-[#666666]">
            <span>Agende</span>
            <span>Pague</span>
            <span>Viaje</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
