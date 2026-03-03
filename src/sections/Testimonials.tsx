import React, { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      id: 1,
      nome: 'Maria S.',
      role: 'Cliente há 6 meses',
      quote: 'Fui cancelada três vezes em um sábado saindo do mercado. Na quarta vez tentei o TUVAI. O motorista chegou, me ajudou a colocar tudo no carro e nunca mais precisei me preocupar com isso.',
      rating: 5,
      initials: 'MS',
    },
    {
      id: 2,
      nome: 'João P.',
      role: 'Cliente há 1 ano',
      quote: 'Uso todo mês para trazer as compras da feira. Já sei o preço antes de sair de casa, o motorista sempre aparece e ainda carrega as sacolas até o apartamento. Não consigo mais imaginar de outro jeito.',
      rating: 5,
      initials: 'JP',
    },
    {
      id: 3,
      nome: 'Ana L.',
      role: 'Cliente há 3 meses',
      quote: 'Minha mãe de 68 anos fazia compras pesadas e ficava constrangida pedindo ajuda na calçada. Apresentei o TUVAI pra ela. Hoje ela agenda sozinha e volta para casa com segurança. Isso não tem preço.',
      rating: 5,
      initials: 'AL',
    },
    {
      id: 4,
      nome: 'Carlos R.',
      role: 'Motorista parceiro',
      quote: 'Trabalho com orgulho porque sei exatamente o que vou encontrar. Sem surpresa, sem estresse. Os clientes são bem-educados e o retorno financeiro é muito melhor do que nos outros aplicativos.',
      rating: 5,
      initials: 'CR',
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
            Quem usa, recomenda
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Mais de 10.000 pessoas já confiaram no TUVAI
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className={`relative max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote className="w-24 h-24 text-[#FF6B00]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FFB800] fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-[#1A1A1A] leading-relaxed mb-8">
                "{testimonials[activeIndex].quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[activeIndex].initials}
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">{testimonials[activeIndex].nome}</p>
                  <p className="text-sm text-[#666666]">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-[#FF6B00] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
