// Sistema de persistência com localStorage
// Facilmente migrável para backend/banco de dados

import type { Cliente, Motorista, Corrida, User } from '@/types';

const STORAGE_KEYS = {
  USERS: 'tuvai_users',
  CLIENTES: 'tuvai_clientes',
  MOTORISTAS: 'tuvai_motoristas',
  CORRIDAS: 'tuvai_corridas',
  SESSION: 'tuvai_session',
  CONFIG: 'tuvai_config',
} as const;

// Configurações do sistema (preços, regras)
export interface SystemConfig {
  valorMinimo: number;
  kmInclusos: number;
  valorKmExcedente: number;
  valorReserva: number;
  taxaCancelamento: number;
  tempoCancelamentoGratis: number; // em horas
}

export const DEFAULT_CONFIG: SystemConfig = {
  valorMinimo: 20,
  kmInclusos: 2,
  valorKmExcedente: 2.80,
  valorReserva: 10,
  taxaCancelamento: 10,
  tempoCancelamentoGratis: 2,
};

// Helpers
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Users
export const getUsers = (): User[] => getItem(STORAGE_KEYS.USERS, []);
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  setItem(STORAGE_KEYS.USERS, users);
};

// Clientes
export const getClientes = (): Cliente[] => getItem(STORAGE_KEYS.CLIENTES, []);
export const saveCliente = (cliente: Cliente): void => {
  const clientes = getClientes();
  const existingIndex = clientes.findIndex(c => c.id === cliente.id);
  if (existingIndex >= 0) {
    clientes[existingIndex] = cliente;
  } else {
    clientes.push(cliente);
  }
  setItem(STORAGE_KEYS.CLIENTES, clientes);
  saveUser(cliente);
};
export const getClienteById = (id: string): Cliente | undefined => {
  return getClientes().find(c => c.id === id);
};
export const getClienteByTelefone = (telefone: string): Cliente | undefined => {
  return getClientes().find(c => c.telefone === telefone);
};

// Motoristas
export const getMotoristas = (): Motorista[] => getItem(STORAGE_KEYS.MOTORISTAS, []);
export const saveMotorista = (motorista: Motorista): void => {
  const motoristas = getMotoristas();
  const existingIndex = motoristas.findIndex(m => m.id === motorista.id);
  if (existingIndex >= 0) {
    motoristas[existingIndex] = motorista;
  } else {
    motoristas.push(motorista);
  }
  setItem(STORAGE_KEYS.MOTORISTAS, motoristas);
  saveUser(motorista);
};
export const getMotoristaById = (id: string): Motorista | undefined => {
  return getMotoristas().find(m => m.id === id);
};
export const getMotoristasAprovados = (): Motorista[] => {
  return getMotoristas().filter(m => m.status === 'aprovado');
};
export const getMotoristasPendentes = (): Motorista[] => {
  return getMotoristas().filter(m => m.status === 'em_analise');
};

// Corridas
export const getCorridas = (): Corrida[] => getItem(STORAGE_KEYS.CORRIDAS, []);
export const saveCorrida = (corrida: Corrida): void => {
  const corridas = getCorridas();
  const existingIndex = corridas.findIndex(c => c.id === corrida.id);
  if (existingIndex >= 0) {
    corridas[existingIndex] = corrida;
  } else {
    corridas.push(corrida);
  }
  setItem(STORAGE_KEYS.CORRIDAS, corridas);
};
export const getCorridaById = (id: string): Corrida | undefined => {
  return getCorridas().find(c => c.id === id);
};
export const getCorridasByCliente = (clienteId: string): Corrida[] => {
  return getCorridas()
    .filter(c => c.clienteId === clienteId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
export const getCorridasByMotorista = (motoristaId: string): Corrida[] => {
  return getCorridas()
    .filter(c => c.motoristaId === motoristaId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
export const getCorridasPendentes = (): Corrida[] => {
  return getCorridas()
    .filter(c => c.status === 'reservado' || c.status === 'confirmado')
    .sort((a, b) => new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime());
};
export const getCorridasDoDia = (data?: string): Corrida[] => {
  const hoje = data || new Date().toISOString().split('T')[0];
  return getCorridas()
    .filter(c => c.dataAgendada === hoje && c.status !== 'cancelado')
    .sort((a, b) => a.horarioAgendado.localeCompare(b.horarioAgendado));
};

// Session
export const getSession = (): { userId: string; tipo: string } | null => {
  return getItem(STORAGE_KEYS.SESSION, null);
};
export const setSession = (userId: string, tipo: string): void => {
  setItem(STORAGE_KEYS.SESSION, { userId, tipo });
};
export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Config
export const getConfig = (): SystemConfig => getItem(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
export const setConfig = (config: Partial<SystemConfig>): void => {
  const current = getConfig();
  setItem(STORAGE_KEYS.CONFIG, { ...current, ...config });
};

// Cálculo de preço
export const calcularPreco = (distanciaKm: number): { valorTotal: number; valorReserva: number; valorRestante: number } => {
  const config = getConfig();
  const kmExcedente = Math.max(0, distanciaKm - config.kmInclusos);
  const valorTotal = Math.max(config.valorMinimo, config.valorMinimo + (kmExcedente * config.valorKmExcedente));
  const valorArredondado = Math.ceil(valorTotal);
  
  return {
    valorTotal: valorArredondado,
    valorReserva: config.valorReserva,
    valorRestante: valorArredondado - config.valorReserva,
  };
};

// Seed data para demonstração
export const seedData = (): void => {
  const clientes = getClientes();
  if (clientes.length === 0) {
    // Criar cliente de teste
    const clienteTeste: Cliente = {
      id: generateId(),
      nome: 'Maria Silva',
      telefone: '(11) 99999-9999',
      tipo: 'cliente',
      enderecos: [{
        id: generateId(),
        nome: 'Casa',
        rua: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
      }],
      createdAt: new Date().toISOString(),
    };
    saveCliente(clienteTeste);

    // Criar motorista de teste
    const motoristaTeste: Motorista = {
      id: generateId(),
      nome: 'João Motorista',
      telefone: '(11) 88888-8888',
      tipo: 'motorista',
      cpf: '123.456.789-00',
      cnh: 'CNH123456',
      placa: 'ABC1234',
      modelo: 'Fiat Uno',
      ano: '2020',
      foto: '',
      comprovanteResidencia: '',
      documentoCarro: '',
      pix: 'joao@email.com',
      status: 'aprovado',
      createdAt: new Date().toISOString(),
    };
    saveMotorista(motoristaTeste);

    // Criar admin
    const admin: User = {
      id: generateId(),
      nome: 'Administrador',
      telefone: '(11) 77777-7777',
      tipo: 'admin',
      createdAt: new Date().toISOString(),
    };
    saveUser(admin);

    console.log('Seed data created successfully');
  }
};

// Inicializar configuração padrão
export const initStorage = (): void => {
  const config = getConfig();
  if (!config.valorMinimo) {
    setConfig(DEFAULT_CONFIG);
  }
};
