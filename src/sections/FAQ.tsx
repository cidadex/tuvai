import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

  const faqs = [
    {
      pergunta: 'Quanto custa o transporte?',
      resposta: 'O valor mínimo é R$20 para até 2km. Acima disso, cobramos R$2,80 por km adicional. A reserva de R$10 é descontada do total.',
    },
    {
      pergunta: 'Como funciona a reserva de R$10?',
      resposta: 'Você paga R$10 para garantir seu motorista. Esse valor é descontado do valor total da corrida. Por exemplo: se a corrida custa R$30, você paga R$10 de reserva e R$20 no final.',
    },
    {
      pergunta: 'Posso cancelar o agendamento?',
      resposta: 'Sim, com até 2 horas de antecedência você recebe o reembolso integral da reserva. Cancelamentos em cima da hora podem resultar na perda da reserva.',
    },
    {
      pergunta: 'O motorista ajuda com as compras?',
      resposta: 'Sim! Nossos motoristas são preparados para ajudar a carregar suas sacolas até o carro. Eles sabem que você está transportando compras e estão prontos para auxiliar.',
    },
    {
      pergunta: 'Quais mercados atendem?',
      resposta: 'Atendemos qualquer mercado ou loja. Você informa o endereço de origem no agendamento e nosso motorista te encontra lá no horário combinado.',
    },
    {
      pergunta: 'É seguro?',
      resposta: 'Sim. Todos os motoristas são verificados com documentação completa (CNH, documento do carro, comprovante de residência). Além disso, você acompanha a corrida em tempo real.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={sectionRef} className="py-20 bg-[#F5F5F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B00]/10 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-[#FF6B00]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-[#666666]">
            Tire suas dúvidas sobre o TU VAI
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${openIndex === index ? 'ring-2 ring-[#FF6B00]' : ''}`}
              style={{ transitionDelay: `${200 + index * 80}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#1A1A1A] pr-4">{faq.pergunta}</span>
                <div
                  className={`w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === index ? 'bg-[#FF6B00] rotate-180' : ''
                  }`}
                >
                  <ChevronDown className={`w-5 h-5 transition-colors ${openIndex === index ? 'text-white' : 'text-[#666666]'}`} />
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-[#666666] leading-relaxed">{faq.resposta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
