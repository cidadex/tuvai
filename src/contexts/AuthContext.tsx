import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Cliente, Motorista } from '@/types';
import {
  getSession,
  setSession,
  clearSession,
  getClienteById,
  getMotoristaById,
  saveCliente,
  saveMotorista,
  getUsers,
  generateId,
} from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (telefone: string, _senha?: string) => Promise<boolean>;
  logout: () => void;
  registerCliente: (data: RegisterClienteData) => Promise<boolean>;
  registerMotorista: (data: RegisterMotoristaData) => Promise<boolean>;
  isAuthenticated: boolean;
  isCliente: boolean;
  isMotorista: boolean;
  isAdmin: boolean;
}

interface RegisterClienteData {
  nome: string;
  telefone: string;
  email?: string;
}

interface RegisterMotoristaData {
  nome: string;
  telefone: string;
  cpf: string;
  cnh: string;
  placa: string;
  modelo: string;
  ano: string;
  pix: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sessão ao iniciar
  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.tipo === 'cliente') {
        const cliente = getClienteById(session.userId);
        if (cliente) setUser(cliente);
      } else if (session.tipo === 'motorista') {
        const motorista = getMotoristaById(session.userId);
        if (motorista) setUser(motorista);
      } else {
        const users = getUsers();
        const foundUser = users.find(u => u.id === session.userId);
        if (foundUser) setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (telefone: string, _senha?: string): Promise<boolean> => {
    // Simplificação: apenas verifica se o telefone existe
    // Em produção, verificar senha também
    const users = getUsers();
    const foundUser = users.find(u => u.telefone === telefone);
    
    if (foundUser) {
      setUser(foundUser);
      setSession(foundUser.id, foundUser.tipo);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  const registerCliente = async (data: RegisterClienteData): Promise<boolean> => {
    const users = getUsers();
    if (users.some(u => u.telefone === data.telefone)) {
      return false; // Telefone já cadastrado
    }

    const newCliente: Cliente = {
      id: generateId(),
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
      tipo: 'cliente',
      enderecos: [],
      createdAt: new Date().toISOString(),
    };

    saveCliente(newCliente);
    setUser(newCliente);
    setSession(newCliente.id, 'cliente');
    return true;
  };

  const registerMotorista = async (data: RegisterMotoristaData): Promise<boolean> => {
    const users = getUsers();
    if (users.some(u => u.telefone === data.telefone)) {
      return false; // Telefone já cadastrado
    }

    const newMotorista: Motorista = {
      id: generateId(),
      nome: data.nome,
      telefone: data.telefone,
      tipo: 'motorista',
      cpf: data.cpf,
      cnh: data.cnh,
      placa: data.placa,
      modelo: data.modelo,
      ano: data.ano,
      foto: '',
      comprovanteResidencia: '',
      documentoCarro: '',
      pix: data.pix,
      status: 'em_analise',
      createdAt: new Date().toISOString(),
    };

    saveMotorista(newMotorista);
    setUser(newMotorista);
    setSession(newMotorista.id, 'motorista');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        registerCliente,
        registerMotorista,
        isAuthenticated: !!user,
        isCliente: user?.tipo === 'cliente',
        isMotorista: user?.tipo === 'motorista',
        isAdmin: user?.tipo === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
