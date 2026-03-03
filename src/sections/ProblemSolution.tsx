import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, X, Check } from 'lucide-react';

const ProblemSolution: React.FC = () => {
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

  const problemPoints = [
    'Motoristas cancelam ao ver compras',
    'Vergonha de ficar esperando na porta',
    'Prejuízo com produtos perecíveis',
    'Humilhação pública',
  ];

  const solutionPoints = [
    'Transporte confirmado, sem rejeição',
    'Motoristas preparados para ajudar',
    'Preço transparente, sem surpresas',
    'Agendamento garantido',
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
            O problema que resolvemos
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Você já passou por isso? Nós também. Por isso criamos o TU VAI.
          </p>
        </div>

        {/* Two Panel Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem Panel */}
          <div
            className={`relative bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            {/* Icon */}
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold text-red-600 mb-4">O problema</h3>
              <p className="text-[#666666] mb-6">
                Você sai do supermercado com as sacolas pesadas, tenta chamar um carro e...{' '}
                <span className="text-red-600 font-semibold">cancelam.</span>
              </p>

              <ul className="space-y-4">
                {problemPoints.map((point, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-[#1A1A1A]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution Panel */}
          <div
            className={`relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            {/* Icon */}
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '1s' }}>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold text-green-600 mb-4">A solução</h3>
              <p className="text-[#666666] mb-6">
                O TU VAI é feito <span className="text-green-600 font-semibold">EXCLUSIVAMENTE</span> para transporte de compras. 
                Nunca mais se preocupe com cancelamento.
              </p>

              <ul className="space-y-4">
                {solutionPoints.map((point, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                    }`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-[#1A1A1A]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
