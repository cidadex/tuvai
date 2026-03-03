// Tipos do sistema TU VAI

export interface User {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  tipo: 'cliente' | 'motorista' | 'admin';
  createdAt: string;
}

export interface Cliente extends User {
  tipo: 'cliente';
  enderecos: Endereco[];
}

export interface Motorista extends User {
  tipo: 'motorista';
  cpf: string;
  cnh: string;
  placa: string;
  modelo: string;
  ano: string;
  foto: string;
  comprovanteResidencia: string;
  pix: string;
  status: 'em_analise' | 'aprovado' | 'rejeitado';
  documentoCarro: string;
}

export interface Endereco {
  id: string;
  nome: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

export interface Corrida {
  id: string;
  clienteId: string;
  motoristaId?: string;
  origem: Endereco;
  destino: Endereco;
  distanciaKm: number;
  valorTotal: number;
  valorReserva: number;
  valorRestante: number;
  tipoCompra: 'leve' | 'media' | 'pesada';
  quantidadePessoas: number;
  observacoes?: string;
  dataAgendada: string;
  horarioAgendado: string;
  status: 'reservado' | 'confirmado' | 'em_rota' | 'finalizado' | 'cancelado';
  pagamentoReservaStatus: 'pendente' | 'pago' | 'reembolsado';
  pagamentoRestanteStatus: 'pendente' | 'pago';
  createdAt: string;
  updatedAt: string;
}

export interface AgendamentoData {
  origem: Endereco;
  destino: Endereco;
  distanciaKm: number;
  tipoCompra: 'leve' | 'media' | 'pesada';
  quantidadePessoas: number;
  observacoes?: string;
  dataAgendada: string;
  horarioAgendado: string;
}

export interface PrecoCalculado {
  distanciaKm: number;
  valorMinimo: number;
  valorKmExcedente: number;
  valorTotal: number;
  valorReserva: number;
  valorRestante: number;
}

export interface FAQItem {
  pergunta: string;
  resposta: string;
}

export interface Testemunho {
  id: string;
  nome: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: string;
}

export interface Estatisticas {
  totalCorridas: number;
  totalMotoristas: number;
  rendaMedia: number;
  avaliacaoMedia: number;
}
