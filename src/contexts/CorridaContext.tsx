import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Corrida, AgendamentoData } from '@/types';
import {
  saveCorrida,
  calcularPreco,
  generateId,
  getCorridasByCliente,
  getCorridasByMotorista,
  getCorridasPendentes,
  getCorridasDoDia,
  getCorridaById,
} from '@/lib/storage';

interface CorridaContextType {
  // Agendamento em progresso
  agendamentoData: AgendamentoData | null;
  setAgendamentoData: (data: AgendamentoData | null) => void;
  
  // Cálculo de preço
  calcularPrecoCorrida: (distanciaKm: number) => { valorTotal: number; valorReserva: number; valorRestante: number };
  
  // Criar corrida
  criarCorrida: (clienteId: string, data: AgendamentoData) => Corrida;
  
  // Atualizar corrida
  atualizarCorrida: (corrida: Corrida) => void;
  
  // Buscar corridas
  getCorridasCliente: (clienteId: string) => Corrida[];
  getCorridasMotorista: (motoristaId: string) => Corrida[];
  getCorridasDisponiveis: () => Corrida[];
  getAgendaDia: (data?: string) => Corrida[];
  
  // Ações do motorista
  aceitarCorrida: (corridaId: string, motoristaId: string) => void;
  iniciarCorrida: (corridaId: string) => void;
  finalizarCorrida: (corridaId: string) => void;
  confirmarPagamento: (corridaId: string) => void;
  
  // Ações do cliente
  cancelarCorrida: (corridaId: string) => void;
}

const CorridaContext = createContext<CorridaContextType | undefined>(undefined);

export const CorridaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agendamentoData, setAgendamentoData] = useState<AgendamentoData | null>(null);

  const calcularPrecoCorrida = useCallback((distanciaKm: number) => {
    return calcularPreco(distanciaKm);
  }, []);

  const criarCorrida = useCallback((clienteId: string, data: AgendamentoData): Corrida => {
    const precos = calcularPreco(data.distanciaKm);
    
    const novaCorrida: Corrida = {
      id: generateId(),
      clienteId,
      origem: data.origem,
      destino: data.destino,
      distanciaKm: data.distanciaKm,
      valorTotal: precos.valorTotal,
      valorReserva: precos.valorReserva,
      valorRestante: precos.valorRestante,
      tipoCompra: data.tipoCompra,
      quantidadePessoas: data.quantidadePessoas,
      observacoes: data.observacoes,
      dataAgendada: data.dataAgendada,
      horarioAgendado: data.horarioAgendado,
      status: 'reservado',
      pagamentoReservaStatus: 'pendente',
      pagamentoRestanteStatus: 'pendente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCorrida(novaCorrida);
    return novaCorrida;
  }, []);

  const atualizarCorrida = useCallback((corrida: Corrida) => {
    saveCorrida({ ...corrida, updatedAt: new Date().toISOString() });
  }, []);

  const getCorridasCliente = useCallback((clienteId: string) => {
    return getCorridasByCliente(clienteId);
  }, []);

  const getCorridasMotorista = useCallback((motoristaId: string) => {
    return getCorridasByMotorista(motoristaId);
  }, []);

  const getCorridasDisponiveis = useCallback(() => {
    return getCorridasPendentes();
  }, []);

  const getAgendaDia = useCallback((data?: string) => {
    return getCorridasDoDia(data);
  }, []);

  const aceitarCorrida = useCallback((corridaId: string, motoristaId: string) => {
    const corrida = getCorridaById(corridaId);
    if (corrida) {
      corrida.motoristaId = motoristaId;
      corrida.status = 'confirmado';
      saveCorrida(corrida);
    }
  }, []);

  const iniciarCorrida = useCallback((corridaId: string) => {
    const corrida = getCorridaById(corridaId);
    if (corrida) {
      corrida.status = 'em_rota';
      saveCorrida(corrida);
    }
  }, []);

  const finalizarCorrida = useCallback((corridaId: string) => {
    const corrida = getCorridaById(corridaId);
    if (corrida) {
      corrida.status = 'finalizado';
      saveCorrida(corrida);
    }
  }, []);

  const confirmarPagamento = useCallback((corridaId: string) => {
    const corrida = getCorridaById(corridaId);
    if (corrida) {
      corrida.pagamentoRestanteStatus = 'pago';
      saveCorrida(corrida);
    }
  }, []);

  const cancelarCorrida = useCallback((corridaId: string) => {
    const corrida = getCorridaById(corridaId);
    if (corrida) {
      corrida.status = 'cancelado';
      saveCorrida(corrida);
    }
  }, []);

  return (
    <CorridaContext.Provider
      value={{
        agendamentoData,
        setAgendamentoData,
        calcularPrecoCorrida,
        criarCorrida,
        atualizarCorrida,
        getCorridasCliente,
        getCorridasMotorista,
        getCorridasDisponiveis,
        getAgendaDia,
        aceitarCorrida,
        iniciarCorrida,
        finalizarCorrida,
        confirmarPagamento,
        cancelarCorrida,
      }}
    >
      {children}
    </CorridaContext.Provider>
  );
};

export const useCorrida = (): CorridaContextType => {
  const context = useContext(CorridaContext);
  if (context === undefined) {
    throw new Error('useCorrida must be used within a CorridaProvider');
  }
  return context;
};
