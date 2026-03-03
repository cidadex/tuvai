import React, { useState, useEffect } from 'react';
import { MapPin, Home, Package, Info, Check, AlertCircle, ChevronRight, Route, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCorrida } from '@/contexts/CorridaContext';
import { calculateRoute, type GeocodedAddress } from '@/lib/maps';
import AddressAutocomplete from './AddressAutocomplete';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { criarCorrida, calcularPrecoCorrida } = useCorrida();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Endereços geocodificados
  const [origemGeocoded, setOrigemGeocoded] = useState<GeocodedAddress | null>(null);
  const [destinoGeocoded, setDestinoGeocoded] = useState<GeocodedAddress | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMinutes: number } | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    origemDescricao: '',
    destinoDescricao: '',
    distanciaKm: 5,
    tipoCompra: 'media' as 'leve' | 'media' | 'pesada',
    quantidadePessoas: 1,
    observacoes: '',
    dataAgendada: '',
    horarioAgendado: '',
  });

  const [checkboxes, setCheckboxes] = useState({
    entendeuReserva: false,
    entendeuRestante: false,
  });

  const preco = calcularPrecoCorrida(routeInfo?.distanceKm || formData.distanciaKm);

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
            setFormData(prev => ({ ...prev, distanciaKm: route.distanceKm }));
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

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      setError('Faça login primeiro para agendar.');
      return;
    }

    if (!origemGeocoded || !destinoGeocoded) {
      setError('Selecione os endereços de origem e destino.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      criarCorrida(user.id, {
        origem: {
          id: Math.random().toString(36).substr(2, 9),
          nome: formData.origemDescricao.split(' - ')[0] || 'Origem',
          rua: origemGeocoded.street || '',
          numero: origemGeocoded.number || '',
          bairro: origemGeocoded.neighborhood || '',
          cidade: origemGeocoded.city || 'São Paulo',
          estado: origemGeocoded.state || 'SP',
          cep: origemGeocoded.zipCode || '00000-000',
        },
        destino: {
          id: Math.random().toString(36).substr(2, 9),
          nome: formData.destinoDescricao.split(' - ')[0] || 'Destino',
          rua: destinoGeocoded.street || '',
          numero: destinoGeocoded.number || '',
          bairro: destinoGeocoded.neighborhood || '',
          cidade: destinoGeocoded.city || 'São Paulo',
          estado: destinoGeocoded.state || 'SP',
          cep: destinoGeocoded.zipCode || '00000-000',
        },
        distanciaKm: routeInfo?.distanceKm || formData.distanciaKm,
        tipoCompra: formData.tipoCompra,
        quantidadePessoas: formData.quantidadePessoas,
        observacoes: formData.observacoes,
        dataAgendada: formData.dataAgendada,
        horarioAgendado: formData.horarioAgendado,
      });

      setSuccess('Agendamento realizado! Redirecionando...');
      setTimeout(() => {
        onClose();
        setSuccess('');
        setStep(1);
        // Reset form
        setFormData({
          origemDescricao: '',
          destinoDescricao: '',
          distanciaKm: 5,
          tipoCompra: 'media',
          quantidadePessoas: 1,
          observacoes: '',
          dataAgendada: '',
          horarioAgendado: '',
        });
        setOrigemGeocoded(null);
        setDestinoGeocoded(null);
        setRouteInfo(null);
        setCheckboxes({ entendeuReserva: false, entendeuRestante: false });
      }, 2000);
    } catch (_err) {
      setError('Erro ao criar agendamento. Tente novamente.');
    }

    setIsLoading(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return origemGeocoded && destinoGeocoded && routeInfo;
      case 2:
        return formData.dataAgendada && formData.horarioAgendado;
      case 3:
        return checkboxes.entendeuReserva && checkboxes.entendeuRestante;
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Origem */}
      <div className="bg-[#FF6B00]/10 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-[#FF6B00]" />
          <span className="font-semibold">Origem (Mercado/Loja)</span>
        </div>
        <AddressAutocomplete
          value={formData.origemDescricao}
          onChange={(value, address) => {
            setFormData(prev => ({ ...prev, origemDescricao: value }));
            setOrigemGeocoded(address || null);
          }}
          placeholder="Buscar mercado, loja ou endereço..."
          type="establishment"
        />
      </div>

      {/* Destino */}
      <div className="bg-green-50 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-5 h-5 text-green-600" />
          <span className="font-semibold">Destino (Sua casa)</span>
        </div>
        <AddressAutocomplete
          value={formData.destinoDescricao}
          onChange={(value, address) => {
            setFormData(prev => ({ ...prev, destinoDescricao: value }));
            setDestinoGeocoded(address || null);
          }}
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
          <span className="text-blue-700">Calculando melhor rota...</span>
        </div>
      )}

      {routeInfo && !isCalculatingRoute && (
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Route className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">Rota calculada</span>
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

      {/* Info */}
      <div className="bg-[#F5F5F5] rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#666666] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#666666]">
            <p>• Valor mínimo: <span className="font-semibold">R$20</span> (até 2km)</p>
            <p>• Acima de 2km: <span className="font-semibold">+R$2,80/km</span></p>
            <p className="mt-1 text-blue-600">
              💡 A distância é calculada automaticamente pela rota de carro
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Data</Label>
          <Input
            type="date"
            value={formData.dataAgendada}
            onChange={(e) => setFormData({ ...formData, dataAgendada: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label>Horário</Label>
          <Input
            type="time"
            value={formData.horarioAgendado}
            onChange={(e) => setFormData({ ...formData, horarioAgendado: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Tipo de compra</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { value: 'leve', label: 'Leve', desc: 'Até 5 sacolas' },
            { value: 'media', label: 'Média', desc: '6-10 sacolas' },
            { value: 'pesada', label: 'Pesada', desc: '11+ sacolas' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormData({ ...formData, tipoCompra: opt.value as any })}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.tipoCompra === opt.value
                  ? 'border-[#FF6B00] bg-[#FF6B00]/5'
                  : 'border-gray-200'
              }`}
            >
              <Package className={`w-5 h-5 mx-auto mb-1 ${formData.tipoCompra === opt.value ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
              <span className="text-sm font-medium block">{opt.label}</span>
              <span className="text-xs text-gray-500">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Quantas pessoas vão?</Label>
        <div className="flex items-center gap-4 mt-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setFormData({ ...formData, quantidadePessoas: num })}
              className={`w-12 h-12 rounded-xl border-2 transition-all ${
                formData.quantidadePessoas === num
                  ? 'border-[#FF6B00] bg-[#FF6B00] text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Observações (opcional)</Label>
        <textarea
          className="w-full p-3 border rounded-xl mt-2 resize-none"
          rows={3}
          placeholder="Ex: Preciso de ajuda para carregar, tenho produtos frágeis..."
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-[#F5F5F5] rounded-2xl p-6">
        <h4 className="font-bold text-lg mb-4">Resumo do agendamento</h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Origem</span>
            <span className="text-right max-w-[60%]">{formData.origemDescricao}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Destino</span>
            <span className="text-right max-w-[60%]">{formData.destinoDescricao}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Data e hora</span>
            <span>{new Date(formData.dataAgendada).toLocaleDateString('pt-BR')} às {formData.horarioAgendado}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Distância</span>
            <span>{(routeInfo?.distanceKm || formData.distanciaKm).toFixed(1)} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tempo estimado</span>
            <span>~{routeInfo?.durationMinutes || '--'} min</span>
          </div>
        </div>

        <div className="border-t my-4" />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total da corrida</span>
            <span className="text-2xl font-bold text-[#FF6B00]">R$ {preco.valorTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reserva (pagar agora)</span>
            <span className="font-semibold">R$ {preco.valorReserva}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Restante (pagar ao final)</span>
            <span className="font-semibold">R$ {preco.valorRestante}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="reserva"
            checked={checkboxes.entendeuReserva}
            onCheckedChange={(checked) => setCheckboxes({ ...checkboxes, entendeuReserva: checked as boolean })}
          />
          <Label htmlFor="reserva" className="text-sm cursor-pointer">
            Entendi que R$10 é reserva e será descontado do total
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="restante"
            checked={checkboxes.entendeuRestante}
            onCheckedChange={(checked) => setCheckboxes({ ...checkboxes, entendeuRestante: checked as boolean })}
          />
          <Label htmlFor="restante" className="text-sm cursor-pointer">
            Entendi que o restante será pago ao final da corrida
          </Label>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-600">
          No MVP, o pagamento é simulado. Na versão completa, integraremos Mercado Pago/PIX.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Agendar Transporte
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s <= step ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Voltar
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-[#FF6B00] hover:bg-[#E55A00]"
              disabled={!canProceed()}
            >
              Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-[#FF6B00] hover:bg-[#E55A00]"
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? 'Processando...' : 'Confirmar Agendamento'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgendamentoModal;
