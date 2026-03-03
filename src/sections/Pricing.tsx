import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Package, Info, Route, Clock, MapPin } from 'lucide-react';
import { calcularPreco } from '@/lib/storage';
import { calculateRoute, type GeocodedAddress } from '@/lib/maps';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface PricingProps {
  onAgendarClick: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onAgendarClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  
  // Endereços
  const [origemGeocoded, setOrigemGeocoded] = useState<GeocodedAddress | null>(null);
  const [destinoGeocoded, setDestinoGeocoded] = useState<GeocodedAddress | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMinutes: number } | null>(null);

  // Fallback: distância manual
  const [distanciaManual, setDistanciaManual] = useState(5);
  const [tipoCompra, setTipoCompra] = useState<'leve' | 'media' | 'pesada'>('media');

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

  // Calcular rota quando ambos os endereços estiverem selecionados
  useEffect(() => {
    const calcularRota = async () => {
      if (origemGeocoded && destinoGeocoded) {
        setIsCalculatingRoute(true);
        try {
          const route = await calculateRoute(
            { lat: origemGeocoded.lat, lng: origemGeocoded.lng },
            { lat: destinoGeocoded.lat, lng: destinoGeocoded.lng }
          );
          if (route) {
            setRouteInfo(route);
          }
        } catch (error) {
          console.error('Error calculating route:', error);
        } finally {
          setIsCalculatingRoute(false);
        }
      }
    };

    calcularRota();
  }, [origemGeocoded, destinoGeocoded]);

  const distanciaUsada = routeInfo?.distanceKm || distanciaManual;
  const preco = calcularPreco(distanciaUsada);

  const tipoCompraOptions = [
    { value: 'leve', label: 'Leve', desc: 'Até 5 sacolas', icon: Package },
    { value: 'media', label: 'Média', desc: '6-10 sacolas', icon: Package },
    { value: 'pesada', label: 'Pesada', desc: '11+ sacolas', icon: Package },
  ];

  return (
    <section id="precos" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
            Preço transparente
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Calcule o valor da sua corrida em tempo real. Informe os endereços e veja o preço exato.
          </p>
        </div>

        {/* Pricing Card */}
        <div className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] p-6">
              <div className="flex items-center gap-3">
                <Calculator className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Calcule sua corrida</h3>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Calculator Inputs */}
                <div className="space-y-6">
                  {/* Origem */}
                  <div className="bg-[#FF6B00]/5 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-[#FF6B00]" />
                      <span className="font-semibold text-sm">Origem (Mercado/Loja)</span>
                    </div>
                    <AddressAutocomplete
                      value=""
                      onChange={(_value, address) => setOrigemGeocoded(address || null)}
                      placeholder="Buscar mercado ou endereço..."
                      type="establishment"
                    />
                  </div>

                  {/* Destino */}
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="font-semibold text-sm">Destino (Sua casa)</span>
                    </div>
                    <AddressAutocomplete
                      value=""
                      onChange={(_value, address) => setDestinoGeocoded(address || null)}
                      placeholder="Buscar seu endereço..."
                      type="address"
                    />
                  </div>

                  {/* Info da Rota */}
                  {isCalculatingRoute && (
                    <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                      <div className="animate-spin">
                        <Route className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-blue-700 text-sm">Calculando melhor rota...</span>
                    </div>
                  )}

                  {routeInfo && !isCalculatingRoute && (
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Route className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700 text-sm">Rota calculada</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            <span className="font-semibold">{routeInfo.distanceKm.toFixed(1)} km</span> de distância
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            <span className="font-semibold">~{routeInfo.durationMinutes} min</span> de viagem
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback: Distância Manual */}
                  {!routeInfo && (
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                        Ou informe a distância manualmente: <span className="text-[#FF6B00] font-bold">{distanciaManual} km</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={distanciaManual}
                        onChange={(e) => setDistanciaManual(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B00]"
                      />
                      <div className="flex justify-between text-xs text-[#666666] mt-2">
                        <span>1 km</span>
                        <span>30 km</span>
                      </div>
                    </div>
                  )}

                  {/* Tipo de Compra */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                      Tipo de compra
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {tipoCompraOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTipoCompra(option.value as 'leve' | 'media' | 'pesada')}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            tipoCompra === option.value
                              ? 'border-[#FF6B00] bg-[#FF6B00]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <option.icon className={`w-5 h-5 mx-auto mb-1 ${tipoCompra === option.value ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                          <span className={`text-xs font-medium block ${tipoCompra === option.value ? 'text-[#FF6B00]' : 'text-[#666666]'}`}>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-[#F5F5F5] rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#666666] flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-[#666666]">
                        <p>• Valor mínimo: <span className="font-semibold">R$20</span> (até 2km)</p>
                        <p>• Acima de 2km: <span className="font-semibold">+R$2,80/km</span></p>
                        <p className="mt-1 text-blue-600">
                          💡 Informe os endereços para cálculo automático da rota
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-br from-[#F5F5F5] to-white rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-[#1A1A1A] mb-6">Resultado</h4>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#666666]">Distância</span>
                      <span className="font-semibold text-[#1A1A1A]">{distanciaUsada.toFixed(1)} km</span>
                    </div>

                    {routeInfo && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#666666]">Tempo estimado</span>
                        <span className="font-semibold text-[#1A1A1A]">~{routeInfo.durationMinutes} min</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#666666]">Valor Total</span>
                        <span className="text-3xl font-bold text-[#FF6B00]">R$ {preco.valorTotal}</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-[#FF6B00] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">1</span>
                          </div>
                          <span className="text-sm text-[#666666]">Reserva agora</span>
                        </div>
                        <span className="font-semibold text-[#1A1A1A]">R$ {preco.valorReserva}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">2</span>
                          </div>
                          <span className="text-sm text-[#666666]">Restante no final</span>
                        </div>
                        <span className="font-semibold text-[#1A1A1A]">R$ {preco.valorRestante}</span>
                      </div>
                    </div>

                    <button
                      onClick={onAgendarClick}
                      className="w-full btn-primary py-4 text-lg"
                    >
                      Agendar Agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
