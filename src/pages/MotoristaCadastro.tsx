import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  User, 
  CreditCard, 
  Car, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  Package,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

const MotoristaCadastro: React.FC = () => {
  const navigate = useNavigate();
  const { registerMotorista } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    cnh: '',
    placa: '',
    modelo: '',
    ano: '',
    pix: '',
  });

  // Checkboxes de termos
  const [termos, setTermos] = useState({
    aceitaTransportarCargas: false,
    aceitaAjudarCompras: false,
    aceitaPassageiros: false,
    aceitaRegrasCancelamento: false,
    aceitaTermosUso: false,
    aceitaPoliticaPrivacidade: false,
  });

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    const success = await registerMotorista(formData);
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setError('Telefone já cadastrado. Faça login ou use outro número.');
    }

    setIsLoading(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.nome && formData.telefone.length >= 14 && formData.cpf.length >= 14;
      case 2:
        return formData.cnh && formData.placa.length >= 7 && formData.modelo && formData.ano.length === 4;
      case 3:
        return formData.pix;
      case 4:
        return true;
      case 5:
        return Object.values(termos).every(v => v === true);
      default:
        return true;
    }
  };

  // Benefícios de ser motorista
  const beneficios = [
    { icon: DollarSign, title: 'Ganhe mais', desc: '30% a mais que outros apps de transporte' },
    { icon: Clock, title: 'Horário flexível', desc: 'Trabalhe quando quiser, sem metas' },
    { icon: Shield, title: 'Corridas garantidas', desc: 'Sem cancelamento, reserva confirmada' },
    { icon: Star, title: 'Avaliação justa', desc: 'Sistema de avaliação transparente' },
  ];

  // Requisitos
  const requisitos = [
    'CNH válida e dentro da validade',
    'Carro em boas condições (ano 2010 ou superior)',
    'Documentação do veículo em dia',
    'Comprovante de residência',
    'Conta bancária ou PIX para recebimento',
    'Não possuir antecedentes criminais',
  ];

  // Diretrizes
  const diretrizes = [
    {
      icon: Package,
      title: 'Transporte de Cargas',
      desc: 'Você concorda em transportar compras, sacolas e pequenas cargas de forma segura. O cliente pode ter de 1 a 20 sacolas dependendo do tipo de compra.',
    },
    {
      icon: Users,
      title: 'Ajudar com as Compras',
      desc: 'Você deve ajudar o cliente a colocar as compras no carro e a retirá-las no destino. Isso é parte do serviço TU VAI.',
    },
    {
      icon: Truck,
      title: 'Passageiros',
      desc: 'O cliente pode ir acompanhado de até 3 pessoas. Você deve transportar todos com segurança e cordialidade.',
    },
    {
      icon: MapPin,
      title: 'Pontualidade',
      desc: 'Chegue no local de origem com 5 minutos de antecedência. O cliente está esperando com compras.',
    },
    {
      icon: Shield,
      title: 'Cancelamentos',
      desc: 'Evite cancelamentos. Se precisar cancelar, faça com pelo menos 2 horas de antecedência. Cancelamentos frequentes podem resultar em desativação.',
    },
    {
      icon: DollarSign,
      title: 'Pagamento',
      desc: 'Você recebe 70% do valor da corrida. O pagamento é feito semanalmente via PIX.',
    },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF6B00]/10 to-[#FF8C42]/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
              Cadastro Enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Seu cadastro foi recebido e está em análise. 
              Você receberá uma notificação em até 48 horas.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-[#FF6B00] hover:bg-[#E55A00]"
            >
              Voltar para o Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF6B00] rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Seja Motorista TU VAI</h1>
              <p className="text-sm text-gray-400">Cadastro de novos motoristas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s <= step ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s < step ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Step 1: Dados Pessoais */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF6B00]" />
                Dados Pessoais
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Nome completo</Label>
                  <Input
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Telefone (WhatsApp)</Label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: formatTelefone(e.target.value) })}
                    maxLength={15}
                  />
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                    maxLength={14}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Dados do Veículo */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Car className="w-5 h-5 text-[#FF6B00]" />
                Dados do Veículo
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Número da CNH</Label>
                  <Input
                    placeholder="Digite o número da sua CNH"
                    value={formData.cnh}
                    onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Placa do carro</Label>
                    <Input
                      placeholder="ABC1234"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                      maxLength={7}
                    />
                  </div>
                  <div>
                    <Label>Ano do carro</Label>
                    <Input
                      placeholder="2020"
                      value={formData.ano}
                      onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <Label>Modelo do carro</Label>
                  <Input
                    placeholder="Ex: Fiat Uno, Honda Civic..."
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">📎 Documentos necessários:</span><br />
                    • Foto da CNH (frente e verso)<br />
                    • Foto do documento do carro<br />
                    • Foto do comprovante de residência<br />
                    • Foto do carro (frente e lateral)
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    No MVP, os documentos serão solicitados após aprovação do cadastro.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Dados Bancários */}
        {step === 3 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FF6B00]" />
                Dados para Pagamento
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Chave PIX</Label>
                  <Input
                    placeholder="CPF, email, telefone ou chave aleatória"
                    value={formData.pix}
                    onChange={(e) => setFormData({ ...formData, pix: e.target.value })}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Você receberá seus pagamentos semanalmente nesta chave PIX.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-700 mb-2">💰 Como funciona o pagamento?</h3>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• Você recebe <span className="font-bold">70%</span> do valor de cada corrida</li>
                    <li>• Pagamento feito toda <span className="font-bold">segunda-feira</span></li>
                    <li>• Correções de valores toda <span className="font-bold">sexta-feira</span></li>
                    <li>• Transferência via PIX (sem taxa)</li>
                  </ul>
                </div>

                <div className="bg-[#FF6B00]/10 p-4 rounded-xl">
                  <h3 className="font-semibold text-[#FF6B00] mb-2">📊 Exemplo de ganhos</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-[#FF6B00]">R$30</p>
                      <p className="text-xs text-gray-600">Corrida</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">R$21</p>
                      <p className="text-xs text-gray-600">Você recebe</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">30</p>
                      <p className="text-xs text-gray-600">Corridas/mês</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-3">
                    Ganho mensal estimado: <span className="font-bold text-[#FF6B00]">R$ 630,00</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Benefícios e Requisitos */}
        {step === 4 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FF6B00]" />
                  Benefícios de ser Motorista TU VAI
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <beneficio.icon className="w-5 h-5 text-[#FF6B00]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{beneficio.title}</p>
                        <p className="text-sm text-gray-600">{beneficio.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#FF6B00]" />
                  Requisitos
                </h2>
                
                <div className="space-y-3">
                  {requisitos.map((req, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Termos e Diretrizes */}
        {step === 5 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#FF6B00]" />
                  Diretrizes do Motorista TU VAI
                </h2>
                
                <div className="space-y-4">
                  {diretrizes.map((dir, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <dir.icon className="w-5 h-5 text-[#FF6B00]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{dir.title}</p>
                        <p className="text-sm text-gray-600">{dir.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Termos de Aceite</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="termo1"
                      checked={termos.aceitaTransportarCargas}
                      onCheckedChange={(checked) => setTermos({ ...termos, aceitaTransportarCargas: checked as boolean })}
                    />
                    <Label htmlFor="termo1" className="text-sm cursor-pointer">
                      Concordo em transportar compras, sacolas e pequenas cargas de forma segura.
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="termo2"
                      checked={termos.aceitaAjudarCompras}
                      onCheckedChange={(checked) => setTermos({ ...termos, aceitaAjudarCompras: checked as boolean })}
                    />
                    <Label htmlFor="termo2" className="text-sm cursor-pointer">
                      Concordo em ajudar os clientes a colocar e retirar as compras do veículo.
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="termo3"
                      checked={termos.aceitaPassageiros}
                      onCheckedChange={(checked) => setTermos({ ...termos, aceitaPassageiros: checked as boolean })}
                    />
                    <Label htmlFor="termo3" className="text-sm cursor-pointer">
                      Concordo em transportar até 4 passageiros (incluindo o cliente) com segurança.
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="termo4"
                      checked={termos.aceitaRegrasCancelamento}
                      onCheckedChange={(checked) => setTermos({ ...termos, aceitaRegrasCancelamento: checked as boolean })}
                    />
                    <Label htmlFor="termo4" className="text-sm cursor-pointer">
                      Concordo com as regras de cancelamento e entendo que cancelamentos frequentes podem resultar em desativação.
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="termo5"
                      checked={termos.aceitaTermosUso}
                      onCheckedChange={(checked) => setTermos({ ...termos, aceitaTermosUso: checked as boolean })}
                    />
                    <Label htmlFor="termo5" className="text-sm cursor-pointer">
                      Li e aceito os <a href="#" className="text-[#FF6B00] underline">Termos de Uso</a> do TU VAI.
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="termo6"
                      checked={termos.aceitaPoliticaPrivacidade}
                      onCheckedChange={(checked) => setTermos({ ...termos, aceitaPoliticaPrivacidade: checked as boolean })}
                    />
                    <Label htmlFor="termo6" className="text-sm cursor-pointer">
                      Li e aceito a <a href="#" className="text-[#FF6B00] underline">Política de Privacidade</a>.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          
          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-[#FF6B00] hover:bg-[#E55A00]"
              disabled={!canProceed()}
            >
              Continuar
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-[#FF6B00] hover:bg-[#E55A00]"
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Cadastro'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default MotoristaCadastro;
